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

  it("should extract all reservoirs with exact expected values", async () => {
    // Arrange
    const mockUrl = "https://example.com/test-url";
    const mockGetCuencaPageHTMLContent = vi.mocked(getCuencaPageHTMLContent);
    mockGetCuencaPageHTMLContent.mockResolvedValue(mockHtmlContent);

    // Expected values based on the HTML mock data
    const expectedReservoirs = [
      { id: 3, nombre: "EMBALSE DE CHARCO REDONDO", aguaActualSAIH: 55.82 },
      { id: 8, nombre: "EMBALSE DE GUADARRANQUE", aguaActualSAIH: 70.74 },
      {
        id: 269,
        nombre: "EMBALSE DE ZAHARA - EL GASTOR",
        aguaActualSAIH: 61.93,
      },
      { id: 270, nombre: "EMBALSE DE BORNOS", aguaActualSAIH: 138.63 },
      {
        id: 271,
        nombre: "EMBALSE ARCOS DE LA FRONTERA",
        aguaActualSAIH: 13.54,
      },
      { id: 272, nombre: "EMBALSE DE HURONES", aguaActualSAIH: 104.83 },
      { id: 273, nombre: "EMBALSE DE GUADALCACÍN", aguaActualSAIH: 358.81 },
      { id: 275, nombre: "EMBALSE DE BARBATE", aguaActualSAIH: 104.62 },
      { id: 276, nombre: "EMBALSE DE CELEMÍN", aguaActualSAIH: 27.91 },
      { id: 277, nombre: "EMBALSE DE ALMODÓVAR", aguaActualSAIH: 4.25 },
      { id: 16, nombre: "EMBALSE DE LA CONCEPCIÓN", aguaActualSAIH: 52.23 },
      { id: 19, nombre: "EMBALSE DE CASASOLA", aguaActualSAIH: 14.4 },
      { id: 20, nombre: "EMBALSE DEL LIMONERO", aguaActualSAIH: 13.48 },
      { id: 29, nombre: "EMBALSE DEL  GUADALTEBA", aguaActualSAIH: 82.26 },
      { id: 30, nombre: "EMBALSE DEL GUADALHORCE", aguaActualSAIH: 55.9 },
      { id: 31, nombre: "EMBALSE CONDE DE GUADALHORCE", aguaActualSAIH: 51.95 },
      { id: 37, nombre: "EMBALSE DE LA VIÑUELA", aguaActualSAIH: 79.07 },
      { id: 51, nombre: "EMBALSE DE RULES", aguaActualSAIH: 88.86 },
      { id: 64, nombre: "EMBALSE DE BEZNAR", aguaActualSAIH: 42.99 },
      { id: 58, nombre: "EMBALSE DE BENINAR", aguaActualSAIH: 9.86 },
      { id: 84, nombre: "EMBALSE CUEVAS DEL ALMANZORA", aguaActualSAIH: 12.17 },
      { id: 371, nombre: "EMBALSE DE CHANZA", aguaActualSAIH: 270.03 },
      { id: 373, nombre: "EMBALSE DE PIEDRAS", aguaActualSAIH: null },
      { id: 374, nombre: "EMBALSE DE LOS MACHOS", aguaActualSAIH: null },
      { id: 375, nombre: "EMBALSE DE CUEVA DE LA MORA", aguaActualSAIH: 1.92 },
      {
        id: 376,
        nombre: "EMBALSE DE SOTIEL - OLIVARGAS",
        aguaActualSAIH: 27.37,
      },
      { id: 377, nombre: "EMBALSE DE CORUMBEL BAJO", aguaActualSAIH: null },
      { id: 379, nombre: "EMBALSE DE JARRAMA", aguaActualSAIH: null },
      { id: 380, nombre: "EMBALSE DE ANDÉVALO", aguaActualSAIH: 344.86 },
    ];

    // Act
    const result = await scrapeCuencaMediterranea(mockUrl);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(expectedReservoirs.length);

    // Check each reservoir individually
    expectedReservoirs.forEach((expected) => {
      const actual = result.find((r) => r.id === expected.id);
      expect(actual).toBeDefined();
      expect(actual!.nombre).toBe(expected.nombre);

      // Handle null values for aguaActualSAIH
      if (expected.aguaActualSAIH === null) {
        expect(actual!.aguaActualSAIH).toBeNaN();
      } else {
        expect(actual!.aguaActualSAIH).toBe(expected.aguaActualSAIH);
      }

      expect(actual!.fechaMedidaSAIH).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    // Verify no unexpected reservoirs
    const actualIds = result.map((r) => r.id).sort();
    const expectedIds = expectedReservoirs.map((r) => r.id).sort();
    expect(actualIds).toEqual(expectedIds);
  });
});
