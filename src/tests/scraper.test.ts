import { describe, it, expect, vi, beforeEach } from "vitest";
import { scrapeCuencaMediterranea } from "../scrapper/scraper";
import { getCuencaPageHTMLContent } from "../api/cuenca.api";
import { mockHtmlContent } from "./mock-html";
import { EmbalseUpdateSAIH } from "../db-model/db.model";

// Mock the API function
vi.mock("../api/cuenca.api", () => ({
  getCuencaPageHTMLContent: vi.fn(),
}));

describe("scrapeCuencaMediterranea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should scrape and parse reservoir data correctly", async () => {
    // Arrange
    const mockUrl = "https://example.com/test-url";
    const mockGetCuencaPageHTMLContent = vi.mocked(getCuencaPageHTMLContent);
    mockGetCuencaPageHTMLContent.mockResolvedValue(mockHtmlContent);

    // Act
    const result = await scrapeCuencaMediterranea(mockUrl);

    // Assert
    expect(mockGetCuencaPageHTMLContent).toHaveBeenCalledWith(mockUrl);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Verify the structure of the first result
    const firstReservoir = result[0];
    expect(firstReservoir).toHaveProperty("id");
    expect(firstReservoir).toHaveProperty("nombre");
    expect(firstReservoir).toHaveProperty("aguaActualSAIH");
    expect(firstReservoir).toHaveProperty("fechaMedidaSAIH");

    // Verify data types
    expect(typeof firstReservoir.id).toBe("number");
    expect(typeof firstReservoir.nombre).toBe("string");
    expect(typeof firstReservoir.aguaActualSAIH).toBe("number");
    expect(typeof firstReservoir.fechaMedidaSAIH).toBe("string");
  });

  it("should extract correct reservoir data from different provinces", async () => {
    // Arrange
    const mockUrl = "https://example.com/test-url";
    const mockGetCuencaPageHTMLContent = vi.mocked(getCuencaPageHTMLContent);
    mockGetCuencaPageHTMLContent.mockResolvedValue(mockHtmlContent);

    // Act
    const result = await scrapeCuencaMediterranea(mockUrl);

    // Assert
    // Check that we have reservoirs from different provinces
    const reservoirNames = result.map((r) => r.nombre);
    expect(reservoirNames).toContain("EMBALSE DE BENINAR"); // ALMERÍA
    expect(reservoirNames).toContain("EMBALSE DE CHARCO REDONDO"); // CÁDIZ
    expect(reservoirNames).toContain("EMBALSE DE ZAHARA - EL GASTOR"); // CÓRDOBA
    expect(reservoirNames).toContain("EMBALSE DE RULES"); // GRANADA
    expect(reservoirNames).toContain("EMBALSE DE CHANZA"); // HUELVA

    // Check specific reservoir data
    const beninarReservoir = result.find(
      (r) => r.nombre === "EMBALSE DE BENINAR"
    );
    expect(beninarReservoir).toBeDefined();
    expect(beninarReservoir!.id).toBe(58);
    expect(beninarReservoir!.aguaActualSAIH).toBe(9.86); // Updated to match actual scraped value with comma parsing
  });

  it("should map EmbalsesAndalucia to EmbalseUpdateSAIH correctly", async () => {
    // Arrange
    const mockUrl = "https://example.com/test-url";
    const mockGetCuencaPageHTMLContent = vi.mocked(getCuencaPageHTMLContent);
    mockGetCuencaPageHTMLContent.mockResolvedValue(mockHtmlContent);

    // Act
    const result = await scrapeCuencaMediterranea(mockUrl);

    // Assert
    const expectedResult: Partial<EmbalseUpdateSAIH> = {
      id: 58,
      nombre: "EMBALSE DE BENINAR",
      aguaActualSAIH: 9.86, // Updated to match actual scraped value with comma parsing
    };

    const beninarReservoir = result.find((r) => r.id === 58);
    expect(beninarReservoir).toMatchObject(expectedResult);

    // Check that fechaMedidaSAIH is in correct format (YYYY-MM-DD)
    expect(beninarReservoir!.fechaMedidaSAIH).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should handle empty or invalid HTML gracefully", async () => {
    // Arrange
    const mockUrl = "https://example.com/test-url";
    const mockGetCuencaPageHTMLContent = vi.mocked(getCuencaPageHTMLContent);
    mockGetCuencaPageHTMLContent.mockResolvedValue(
      "<html><body></body></html>"
    );

    // Act
    const result = await scrapeCuencaMediterranea(mockUrl);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
