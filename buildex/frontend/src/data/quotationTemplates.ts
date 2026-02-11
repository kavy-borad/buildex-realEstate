import { CostItem } from "@/types/quotation";

export interface QuotationTemplate {
    id: string;
    name: string;
    description: string;
    items: Omit<CostItem, 'id' | 'total'>[];
    qualityVariants?: {
        basic: Omit<CostItem, 'id' | 'total'>[];
        standard: Omit<CostItem, 'id' | 'total'>[];
        premium: Omit<CostItem, 'id' | 'total'>[];
    }
}

export const constructionTemplates: QuotationTemplate[] = [
    // =========================================================================
    // 🏗️ CONSTRUCTION QUALITY TEMPLATES (Auto-load based on quality selection)
    // =========================================================================
    {
        id: 'quality-basic',
        name: '🔵 Basic Quality Construction',
        description: 'Economical construction with standard materials and basic finishes.',
        items: [
            { itemName: 'RCC Structure Work', quantity: 2500, unit: 'Cubic ft', rate: 650 },
            { itemName: 'Standard Vitrified Tiles Flooring', quantity: 2500, unit: 'Sq.ft', rate: 85 },
            { itemName: 'Basic Door Frames (Sal Wood)', quantity: 15, unit: 'Nos', rate: 3500 },
            { itemName: 'Aluminum Windows', quantity: 400, unit: 'Sq.ft', rate: 350 },
            { itemName: 'Basic Kitchen Setup', quantity: 1, unit: 'Lump Sum', rate: 75000 },
            { itemName: 'Gypsum Plastering (Internal)', quantity: 5000, unit: 'Sq.ft', rate: 45 },
            { itemName: 'Basic Bathroom Fittings', quantity: 4, unit: 'Nos', rate: 12000 },
            { itemName: 'Standard Electrical Works', quantity: 1, unit: 'Lump Sum', rate: 85000 },
            { itemName: 'Basic Plumbing (PVC)', quantity: 1, unit: 'Lump Sum', rate: 65000 },
            { itemName: 'Emulsion Painting (Asian Paints)', quantity: 5000, unit: 'Sq.ft', rate: 28 }
        ]
    },
    {
        id: 'quality-standard',
        name: '🟢 Standard Quality Construction',
        description: 'Mid-range construction with good quality materials and finishes.',
        items: [
            { itemName: 'RCC Structure Work (M25)', quantity: 2500, unit: 'Cubic ft', rate: 680 },
            { itemName: 'Premium Vitrified Tiles (800x800)', quantity: 2500, unit: 'Sq.ft', rate: 140 },
            { itemName: 'Teak Wood Door Frames', quantity: 15, unit: 'Nos', rate: 8500 },
            { itemName: 'UPVC Windows (Standard)', quantity: 400, unit: 'Sq.ft', rate: 550 },
            { itemName: 'Modular Kitchen (Standard)', quantity: 1, unit: 'Lump Sum', rate: 150000 },
            { itemName: 'POP False Ceiling', quantity: 2000, unit: 'Sq.ft', rate: 95 },
            { itemName: 'Standard Bathroom Fittings (Jaquar)', quantity: 4, unit: 'Nos', rate: 35000 },
            { itemName: 'Premium Electrical Works', quantity: 1, unit: 'Lump Sum', rate: 125000 },
            { itemName: 'CPVC Plumbing (Astral)', quantity: 1, unit: 'Lump Sum', rate: 95000 },
            { itemName: 'Premium Emulsion + Texture', quantity: 5000, unit: 'Sq.ft', rate: 42 }
        ]
    },
    {
        id: 'quality-premium',
        name: '🟡 Premium Quality Construction',
        description: 'Luxury construction with high-end materials and premium finishes.',
        items: [
            { itemName: 'RCC Structure Work (M30 Waterproof)', quantity: 2500, unit: 'Cubic ft', rate: 750 },
            { itemName: 'Italian Marble Flooring', quantity: 2500, unit: 'Sq.ft', rate: 450 },
            { itemName: 'Teak Wood Door Frames (Premium)', quantity: 15, unit: 'Nos', rate: 12500 },
            { itemName: 'UPVC Windows (Premium)', quantity: 400, unit: 'Sq.ft', rate: 850 },
            { itemName: 'Modular Kitchen (High Gloss)', quantity: 1, unit: 'Lump Sum', rate: 280000 },
            { itemName: 'Designer False Ceiling (POP + Lights)', quantity: 3000, unit: 'Sq.ft', rate: 135 },
            { itemName: 'Luxury Bathroom Fittings (Grohe/Kohler)', quantity: 4, unit: 'Nos', rate: 85000 },
            { itemName: 'Premium Electrical + Smart Home', quantity: 1, unit: 'Lump Sum', rate: 180000 },
            { itemName: 'Premium CPVC + Concealed Fittings', quantity: 1, unit: 'Lump Sum', rate: 125000 },
            { itemName: 'Designer Wall Finishes + Textures', quantity: 5000, unit: 'Sq.ft', rate: 65 }
        ]
    },

    // =========================================================================
    // 🏠 RESIDENTIAL PROJECTS
    // =========================================================================
    {
        id: 'residential-villa',
        name: 'Residential - Villa Construction (Turnkey)',
        description: 'Complete villa construction from foundation to finishing.',
        items: [
            { itemName: 'Excavation & Earthwork', quantity: 1500, unit: 'Cubic ft', rate: 15 },
            { itemName: 'PCC Foundation (1:4:8)', quantity: 600, unit: 'Cubic ft', rate: 380 },
            { itemName: 'RCC Work (Columns/Beams/Slabs) M25', quantity: 1200, unit: 'Cubic ft', rate: 600 },
            { itemName: 'Brickwork (9 inch) - Red Bricks', quantity: 3000, unit: 'Sq.ft', rate: 95 },
            { itemName: 'Internal Plastering (Gypsum/Cement)', quantity: 5000, unit: 'Sq.ft', rate: 55 },
            { itemName: 'External Plastering (Double Coat)', quantity: 3500, unit: 'Sq.ft', rate: 75 },
            { itemName: 'Premium Vitrified Flooring', quantity: 2000, unit: 'Sq.ft', rate: 150 },
            { itemName: 'Bathroom Tiling (Wall + Floor)', quantity: 800, unit: 'Sq.ft', rate: 120 },
            { itemName: 'Electrical Works (Standard)', quantity: 1, unit: 'Lump Sum', rate: 120000 },
            { itemName: 'Plumbing Works (CPVC/PVC)', quantity: 1, unit: 'Lump Sum', rate: 95000 },
            { itemName: 'Painting (Premium Emulsion)', quantity: 5000, unit: 'Sq.ft', rate: 35 },
            { itemName: 'Main Gate & Compound Wall', quantity: 1, unit: 'Lump Sum', rate: 85000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Excavation & Earthwork', quantity: 1500, unit: 'Cubic ft', rate: 12 },
                { itemName: 'PCC Foundation (1:4:8)', quantity: 600, unit: 'Cubic ft', rate: 350 },
                { itemName: 'RCC Work (M20)', quantity: 1200, unit: 'Cubic ft', rate: 550 },
                { itemName: 'Brickwork (9 inch) - Red Bricks', quantity: 3000, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Internal Plastering (Cement)', quantity: 5000, unit: 'Sq.ft', rate: 45 },
                { itemName: 'External Plastering (Single Coat)', quantity: 3500, unit: 'Sq.ft', rate: 55 },
                { itemName: 'Standard Vitrified Flooring', quantity: 2000, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Bathroom Tiling (Basic)', quantity: 800, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Electrical Works (Basic)', quantity: 1, unit: 'Lump Sum', rate: 95000 },
                { itemName: 'Plumbing Works (PVC)', quantity: 1, unit: 'Lump Sum', rate: 75000 },
                { itemName: 'Painting (Emulsion)', quantity: 5000, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Main Gate & Compound', quantity: 1, unit: 'Lump Sum', rate: 65000 }
            ],
            standard: [
                { itemName: 'Excavation & Earthwork', quantity: 1500, unit: 'Cubic ft', rate: 15 },
                { itemName: 'PCC Foundation (1:4:8)', quantity: 600, unit: 'Cubic ft', rate: 380 },
                { itemName: 'RCC Work (M25)', quantity: 1200, unit: 'Cubic ft', rate: 600 },
                { itemName: 'Brickwork (9 inch) - Red Bricks', quantity: 3000, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Internal Plastering (Gypsum/Cement)', quantity: 5000, unit: 'Sq.ft', rate: 55 },
                { itemName: 'External Plastering (Double Coat)', quantity: 3500, unit: 'Sq.ft', rate: 75 },
                { itemName: 'Premium Vitrified Flooring', quantity: 2000, unit: 'Sq.ft', rate: 150 },
                { itemName: 'Bathroom Tiling (Wall + Floor)', quantity: 800, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Electrical Works (Standard)', quantity: 1, unit: 'Lump Sum', rate: 120000 },
                { itemName: 'Plumbing Works (CPVC/PVC)', quantity: 1, unit: 'Lump Sum', rate: 95000 },
                { itemName: 'Painting (Premium Emulsion)', quantity: 5000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Main Gate & Compound Wall', quantity: 1, unit: 'Lump Sum', rate: 85000 }
            ],
            premium: [
                { itemName: 'Excavation & Earthwork', quantity: 1500, unit: 'Cubic ft', rate: 18 },
                { itemName: 'PCC Foundation (1:3:6)', quantity: 600, unit: 'Cubic ft', rate: 450 },
                { itemName: 'RCC Work (M30 Waterproof)', quantity: 1200, unit: 'Cubic ft', rate: 750 },
                { itemName: 'Brickwork (9 inch) - AAC Blocks', quantity: 3000, unit: 'Sq.ft', rate: 125 },
                { itemName: 'Internal Plastering (Premium Gypsum)', quantity: 5000, unit: 'Sq.ft', rate: 75 },
                { itemName: 'External Plastering (Texture + Weathercoat)', quantity: 3500, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Italian Marble Flooring', quantity: 2000, unit: 'Sq.ft', rate: 450 },
                { itemName: 'Bathroom Premium Tiling (Imported)', quantity: 800, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Electrical Works (Smart Home)', quantity: 1, unit: 'Lump Sum', rate: 180000 },
                { itemName: 'Plumbing Works (Premium CPVC + Concealed)', quantity: 1, unit: 'Lump Sum', rate: 135000 },
                { itemName: 'Painting (Designer + Textures)', quantity: 5000, unit: 'Sq.ft', rate: 55 },
                { itemName: 'Designer Gate & Compound', quantity: 1, unit: 'Lump Sum', rate: 150000 }
            ]
        }
    },
    {
        id: 'residential-bungalow',
        name: 'Residential - Luxury Bungalow',
        description: 'High-end bungalow with premium finishes.',
        items: [
            { itemName: 'RCC Structure Work', quantity: 2500, unit: 'Cubic ft', rate: 650 },
            { itemName: 'Italian Marble Flooring', quantity: 2500, unit: 'Sq.ft', rate: 450 },
            { itemName: 'Teak Wood Door Frames', quantity: 15, unit: 'Nos', rate: 8500 },
            { itemName: 'UPVC Windows (Premium)', quantity: 400, unit: 'Sq.ft', rate: 850 },
            { itemName: 'Modular Kitchen (High Gloss)', quantity: 1, unit: 'Lump Sum', rate: 250000 },
            { itemName: 'False Ceiling (POP + Light)', quantity: 3000, unit: 'Sq.ft', rate: 120 },
            { itemName: 'Luxury Bathroom Fittings (Grohe/Kohler)', quantity: 4, unit: 'Nos', rate: 75000 },
            { itemName: 'Home Automation Wiring', quantity: 1, unit: 'Lump Sum', rate: 150000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'RCC Structure Work', quantity: 2500, unit: 'Cubic ft', rate: 550 },
                { itemName: 'Standard Vitrified Flooring', quantity: 2500, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Sal Wood Door Frames', quantity: 15, unit: 'Nos', rate: 4500 },
                { itemName: 'Aluminum Windows', quantity: 400, unit: 'Sq.ft', rate: 350 },
                { itemName: 'Basic Kitchen Setup', quantity: 1, unit: 'Lump Sum', rate: 85000 },
                { itemName: 'Basic False Ceiling', quantity: 3000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Standard Bathroom Fittings', quantity: 4, unit: 'Nos', rate: 18000 },
                { itemName: 'Basic Electrical Wiring', quantity: 1, unit: 'Lump Sum', rate: 85000 }
            ],
            standard: [
                { itemName: 'RCC Structure Work', quantity: 2500, unit: 'Cubic ft', rate: 650 },
                { itemName: 'Premium Vitrified Flooring', quantity: 2500, unit: 'Sq.ft', rate: 180 },
                { itemName: 'Teak Wood Door Frames', quantity: 15, unit: 'Nos', rate: 8500 },
                { itemName: 'UPVC Windows (Standard)', quantity: 400, unit: 'Sq.ft', rate: 550 },
                { itemName: 'Modular Kitchen (Standard)', quantity: 1, unit: 'Lump Sum', rate: 150000 },
                { itemName: 'False Ceiling (POP + Light)', quantity: 3000, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Premium Bathroom Fittings (Jaquar)', quantity: 4, unit: 'Nos', rate: 45000 },
                { itemName: 'Premium Electrical Works', quantity: 1, unit: 'Lump Sum', rate: 130000 }
            ],
            premium: [
                { itemName: 'RCC Structure Work (M30)', quantity: 2500, unit: 'Cubic ft', rate: 780 },
                { itemName: 'Italian Marble Flooring', quantity: 2500, unit: 'Sq.ft', rate: 450 },
                { itemName: 'Teak Wood Door Frames (Premium)', quantity: 15, unit: 'Nos', rate: 12500 },
                { itemName: 'UPVC Windows (Premium)', quantity: 400, unit: 'Sq.ft', rate: 850 },
                { itemName: 'Modular Kitchen (High Gloss)', quantity: 1, unit: 'Lump Sum', rate: 280000 },
                { itemName: 'Designer False Ceiling (POP + Lights)', quantity: 3000, unit: 'Sq.ft', rate: 165 },
                { itemName: 'Luxury Bathroom Fittings (Grohe/Kohler)', quantity: 4, unit: 'Nos', rate: 85000 },
                { itemName: 'Smart Home Automation', quantity: 1, unit: 'Lump Sum', rate: 200000 }
            ]
        }
    },
    {
        id: 'residential-apartment',
        name: 'Residential - Apartment Interior',
        description: 'Standard 2BHK/3BHK interior finishing package.',
        items: [
            { itemName: 'False Ceiling (Gypsum)', quantity: 800, unit: 'Sq.ft', rate: 95 },
            { itemName: 'Wall Painting (Royal)', quantity: 2500, unit: 'Sq.ft', rate: 45 },
            { itemName: 'TV Unit & Console', quantity: 1, unit: 'Nos', rate: 35000 },
            { itemName: 'Wardrobes (Laminate Finish)', quantity: 300, unit: 'Sq.ft', rate: 1600 },
            { itemName: 'Modular Kitchen Trolleys', quantity: 1, unit: 'Lump Sum', rate: 85000 },
            { itemName: 'Basic Electrical Fillings', quantity: 20, unit: 'Nos', rate: 450 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'False Ceiling (Basic)', quantity: 800, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Wall Painting (Basic)', quantity: 2500, unit: 'Sq.ft', rate: 28 },
                { itemName: 'TV Unit (Basic)', quantity: 1, unit: 'Nos', rate: 18000 },
                { itemName: 'Wardrobes (Laminate)', quantity: 300, unit: 'Sq.ft', rate: 1200 },
                { itemName: 'Basic Kitchen Trolleys', quantity: 1, unit: 'Lump Sum', rate: 55000 },
                { itemName: 'Electrical Fittings', quantity: 20, unit: 'Nos', rate: 350 }
            ],
            standard: [
                { itemName: 'False Ceiling (Gypsum)', quantity: 800, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Wall Painting (Royal)', quantity: 2500, unit: 'Sq.ft', rate: 45 },
                { itemName: 'TV Unit & Console', quantity: 1, unit: 'Nos', rate: 35000 },
                { itemName: 'Wardrobes (Laminate Finish)', quantity: 300, unit: 'Sq.ft', rate: 1600 },
                { itemName: 'Modular Kitchen Trolleys', quantity: 1, unit: 'Lump Sum', rate: 85000 },
                { itemName: 'Premium Electrical Fittings', quantity: 20, unit: 'Nos', rate: 450 }
            ],
            premium: [
                { itemName: 'Designer False Ceiling (POP)', quantity: 800, unit: 'Sq.ft', rate: 135 },
                { itemName: 'Wall Painting (Designer + Texture)', quantity: 2500, unit: 'Sq.ft', rate: 68 },
                { itemName: 'Premium TV Unit & Console', quantity: 1, unit: 'Nos', rate: 65000 },
                { itemName: 'Designer Wardrobes (Premium)', quantity: 300, unit: 'Sq.ft', rate: 2200 },
                { itemName: 'Premium Modular Kitchen', quantity: 1, unit: 'Lump Sum', rate: 150000 },
                { itemName: 'Designer Electrical Fittings', quantity: 20, unit: 'Nos', rate: 750 }
            ]
        }
    },
    {
        id: 'residential-farmhouse',
        name: 'Residential - Farmhouse',
        description: 'Farmhouse construction with basic amenities and fencing.',
        items: [
            { itemName: 'Load Bearing Structure', quantity: 1200, unit: 'Sq.ft', rate: 900 },
            { itemName: 'Mangalore Tile Roofing', quantity: 1400, unit: 'Sq.ft', rate: 180 },
            { itemName: 'Rough Shahabad Stone Flooring', quantity: 1200, unit: 'Sq.ft', rate: 85 },
            { itemName: 'Chain Link Fencing (5ft)', quantity: 500, unit: 'Running ft', rate: 150 },
            { itemName: 'Basic Plumbing & Septic Tank', quantity: 1, unit: 'Lump Sum', rate: 65000 },
            { itemName: 'Verandah Civil Work', quantity: 400, unit: 'Sq.ft', rate: 650 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Load Bearing Structure', quantity: 1200, unit: 'Sq.ft', rate: 750 },
                { itemName: 'Clay Tile Roofing', quantity: 1400, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Cement Flooring', quantity: 1200, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Chain Link Fencing (4ft)', quantity: 500, unit: 'Running ft', rate: 120 },
                { itemName: 'Basic Plumbing & Tank', quantity: 1, unit: 'Lump Sum', rate: 45000 },
                { itemName: 'Verandah Basic Work', quantity: 400, unit: 'Sq.ft', rate: 450 }
            ],
            standard: [
                { itemName: 'Load Bearing Structure', quantity: 1200, unit: 'Sq.ft', rate: 900 },
                { itemName: 'Mangalore Tile Roofing', quantity: 1400, unit: 'Sq.ft', rate: 180 },
                { itemName: 'Shahabad Stone Flooring', quantity: 1200, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Chain Link Fencing (5ft)', quantity: 500, unit: 'Running ft', rate: 150 },
                { itemName: 'Plumbing & Septic Tank', quantity: 1, unit: 'Lump Sum', rate: 65000 },
                { itemName: 'Verandah Civil Work', quantity: 400, unit: 'Sq.ft', rate: 650 }
            ],
            premium: [
                { itemName: 'RCC Structure Work', quantity: 1200, unit: 'Sq.ft', rate: 1150 },
                { itemName: 'Designer Tile Roofing', quantity: 1400, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Kota Stone Flooring', quantity: 1200, unit: 'Sq.ft', rate: 145 },
                { itemName: 'Designer Fencing (6ft)', quantity: 500, unit: 'Running ft', rate: 220 },
                { itemName: 'Premium Plumbing System', quantity: 1, unit: 'Lump Sum', rate: 95000 },
                { itemName: 'Designer Verandah', quantity: 400, unit: 'Sq.ft', rate: 950 }
            ]
        }
    },

    {
        id: 'residential-duplex',
        name: 'Residential - Duplex House',
        description: 'Two-story residential unit with internal staircase.',
        items: [
            { itemName: 'RCC Structure Work (G+1)', quantity: 3000, unit: 'Sq.ft', rate: 1400 },
            { itemName: 'Internal Staircase (Granite/Marble)', quantity: 1, unit: 'Lump Sum', rate: 85000 },
            { itemName: 'Vitrified Flooring (Double Charged)', quantity: 2800, unit: 'Sq.ft', rate: 120 },
            { itemName: 'Modular Kitchen (L-Shape)', quantity: 1, unit: 'Nos', rate: 180000 },
            { itemName: 'Bathroom Fittings (3 Bathrooms)', quantity: 1, unit: 'Lump Sum', rate: 120000 },
            { itemName: 'Electrical & Plumbing', quantity: 1, unit: 'Lump Sum', rate: 250000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'RCC Structure Work', quantity: 3000, unit: 'Sq.ft', rate: 1200 },
                { itemName: 'Internal Staircase (Tiles)', quantity: 1, unit: 'Lump Sum', rate: 45000 },
                { itemName: 'Standard Flooring', quantity: 2800, unit: 'Sq.ft', rate: 90 },
                { itemName: 'Semi-Modular Kitchen', quantity: 1, unit: 'Nos', rate: 90000 },
                { itemName: 'Basic Bathroom Fittings', quantity: 1, unit: 'Lump Sum', rate: 80000 },
                { itemName: 'Basic Electrical/Plumbing', quantity: 1, unit: 'Lump Sum', rate: 180000 }
            ],
            standard: [
                { itemName: 'RCC Structure Work', quantity: 3000, unit: 'Sq.ft', rate: 1400 },
                { itemName: 'Internal Staircase (Granite)', quantity: 1, unit: 'Lump Sum', rate: 85000 },
                { itemName: 'Vitrified Flooring', quantity: 2800, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Modular Kitchen', quantity: 1, unit: 'Nos', rate: 180000 },
                { itemName: 'Standard Bathroom Fittings', quantity: 1, unit: 'Lump Sum', rate: 120000 },
                { itemName: 'Std Electrical/Plumbing', quantity: 1, unit: 'Lump Sum', rate: 250000 }
            ],
            premium: [
                { itemName: 'RCC Structure (M30)', quantity: 3000, unit: 'Sq.ft', rate: 1650 },
                { itemName: 'Italian Marble Staircase', quantity: 1, unit: 'Lump Sum', rate: 250000 },
                { itemName: 'Italian Marble Flooring', quantity: 2800, unit: 'Sq.ft', rate: 450 },
                { itemName: 'Premium Modular Kitchen', quantity: 1, unit: 'Nos', rate: 350000 },
                { itemName: 'Luxury Bathroom Fittings', quantity: 1, unit: 'Lump Sum', rate: 280000 },
                { itemName: 'Premium Electrical/Plumbing', quantity: 1, unit: 'Lump Sum', rate: 450000 }
            ]
        }
    },
    {
        id: 'commercial-retail',
        name: 'Commercial - Retail Shop',
        description: 'Retail outlet setup including racking and frontage.',
        items: [],
        qualityVariants: {
            basic: [
                { itemName: 'Glass Facade (10mm)', quantity: 200, unit: 'Sq.ft', rate: 750 },
                { itemName: 'Standard Tile Flooring', quantity: 500, unit: 'Sq.ft', rate: 90 },
                { itemName: 'Basic False Ceiling', quantity: 500, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Metal Racks', quantity: 10, unit: 'Nos', rate: 4500 },
                { itemName: 'Flex Board', quantity: 1, unit: 'Nos', rate: 8000 }
            ],
            standard: [
                { itemName: 'Glass Facade (12mm)', quantity: 200, unit: 'Sq.ft', rate: 950 },
                { itemName: 'Heavy Duty Flooring', quantity: 500, unit: 'Sq.ft', rate: 150 },
                { itemName: 'Grid False Ceiling', quantity: 500, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Modular Racks', quantity: 10, unit: 'Nos', rate: 8500 },
                { itemName: 'LED Sign Board', quantity: 1, unit: 'Nos', rate: 25000 }
            ],
            premium: [
                { itemName: 'Frameless Glass Facade', quantity: 200, unit: 'Sq.ft', rate: 1400 },
                { itemName: 'Granite/Italian Flooring', quantity: 500, unit: 'Sq.ft', rate: 350 },
                { itemName: 'Designer Ceiling', quantity: 500, unit: 'Sq.ft', rate: 145 },
                { itemName: 'Premium Display Units', quantity: 10, unit: 'Nos', rate: 18000 },
                { itemName: '3D Acrylic Signage', quantity: 1, unit: 'Nos', rate: 55000 }
            ]
        }
    },
    {
        id: 'factory-manufacturing',
        name: 'Industrial - Factory/Manufacturing Unit',
        description: 'Heavy industrial shed with reinforced flooring.',
        items: [],
        qualityVariants: {
            basic: [
                { itemName: 'PEB Structure (Standard)', quantity: 10000, unit: 'Kg', rate: 85 },
                { itemName: 'IPS Flooring', quantity: 5000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Galvalume Sheets', quantity: 5000, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Basic Foundation', quantity: 1, unit: 'Lump Sum', rate: 120000 },
                { itemName: 'Basic Panel', quantity: 1, unit: 'Nos', rate: 85000 }
            ],
            standard: [
                { itemName: 'PEB Structure (Heavy Duty)', quantity: 10000, unit: 'Kg', rate: 95 },
                { itemName: 'VDF Flooring (M25)', quantity: 5000, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Metal Roofing', quantity: 5000, unit: 'Sq.ft', rate: 110 },
                { itemName: 'Machine Foundation', quantity: 1, unit: 'Lump Sum', rate: 250000 },
                { itemName: 'Control Panel', quantity: 1, unit: 'Nos', rate: 150000 }
            ],
            premium: [
                { itemName: 'PEB Structure (Custom)', quantity: 10000, unit: 'Kg', rate: 120 },
                { itemName: 'Epoxy/PU Flooring', quantity: 5000, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Puff Panel Roofing', quantity: 5000, unit: 'Sq.ft', rate: 220 },
                { itemName: 'Heavy Duty Foundation', quantity: 1, unit: 'Lump Sum', rate: 450000 },
                { itemName: 'Automation Panel', quantity: 1, unit: 'Nos', rate: 350000 }
            ]
        }
    },
    {
        id: 'interior-design',
        name: 'Interior Design - Full Home',
        description: 'End-to-end interior designing and execution.',
        items: [],
        qualityVariants: {
            basic: [
                { itemName: 'Standard TV Unit', quantity: 1, unit: 'Nos', rate: 25000 },
                { itemName: 'Modular Kitchen (Laminate)', quantity: 1, unit: 'Lump Sum', rate: 120000 },
                { itemName: 'Wardrobes (Laminate)', quantity: 300, unit: 'Sq.ft', rate: 1100 },
                { itemName: 'Basic False Ceiling', quantity: 1000, unit: 'Sq.ft', rate: 75 },
                { itemName: 'Wall Painting', quantity: 2000, unit: 'Sq.ft', rate: 35 }
            ],
            standard: [
                { itemName: 'Designer TV Unit', quantity: 1, unit: 'Nos', rate: 45000 },
                { itemName: 'Modular Kitchen (Acrylic)', quantity: 1, unit: 'Lump Sum', rate: 220000 },
                { itemName: 'Wardrobes (Acrylic/PU)', quantity: 300, unit: 'Sq.ft', rate: 1600 },
                { itemName: 'Designer False Ceiling', quantity: 1000, unit: 'Sq.ft', rate: 110 },
                { itemName: 'Royal Shine Paint', quantity: 2000, unit: 'Sq.ft', rate: 55 }
            ],
            premium: [
                { itemName: 'Premium TV Unit (Stone/Veneer)', quantity: 1, unit: 'Nos', rate: 85000 },
                { itemName: 'High-End Kitchen (Hafele/Blum)', quantity: 1, unit: 'Lump Sum', rate: 450000 },
                { itemName: 'Wardrobes (Veneer/Glass)', quantity: 300, unit: 'Sq.ft', rate: 2800 },
                { itemName: 'Luxury Ceiling + Lighting', quantity: 1000, unit: 'Sq.ft', rate: 180 },
                { itemName: 'Texture + Special Effects', quantity: 2000, unit: 'Sq.ft', rate: 120 }
            ]
        }
    },
    {
        id: 'structural-repair',
        name: 'Structural Repair & Rehabilitation',
        description: 'Repairing damaged RCC members and strengthening.',
        items: [],
        qualityVariants: {
            basic: [
                { itemName: 'Plaster Repair (Patch work)', quantity: 500, unit: 'Sq.ft', rate: 150 },
                { itemName: 'Crack Filling (Epoxy)', quantity: 200, unit: 'Running ft', rate: 85 },
                { itemName: 'Anti-Corrosion Treatment', quantity: 100, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Waterproofing Coating', quantity: 500, unit: 'Sq.ft', rate: 35 }
            ],
            standard: [
                { itemName: 'Micro Concrete Jacketing', quantity: 50, unit: 'Cubic ft', rate: 1800 },
                { itemName: 'Polymer Modified Mortar', quantity: 500, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Rebar Planting', quantity: 50, unit: 'Nos', rate: 450 },
                { itemName: 'Injection Grouting', quantity: 1, unit: 'Lump Sum', rate: 25000 }
            ],
            premium: [
                { itemName: 'Carbon Fiber Wrapping', quantity: 200, unit: 'Sq.ft', rate: 1500 },
                { itemName: 'Structural Steel Support', quantity: 1000, unit: 'Kg', rate: 120 },
                { itemName: 'Advanced Chemical Anchoring', quantity: 50, unit: 'Nos', rate: 850 },
                { itemName: 'Complete Structural Audit & Fix', quantity: 1, unit: 'Lump Sum', rate: 150000 }
            ]
        }
    },
    // =========================================================================
    // 🏢 COMMERCIAL & INDUSTRIAL
    // =========================================================================
    {
        id: 'commercial-office',
        name: 'Commercial - Office Fit-out',
        description: 'Corporate office setup with partitions and workstations.',
        items: [
            { itemName: 'Glass Partitions (12mm Toughened)', quantity: 500, unit: 'Sq.ft', rate: 650 },
            { itemName: 'Grid False Ceiling (2x2)', quantity: 1500, unit: 'Sq.ft', rate: 75 },
            { itemName: 'Carpet Tile Flooring', quantity: 1500, unit: 'Sq.ft', rate: 140 },
            { itemName: 'Workstations (Modular)', quantity: 20, unit: 'Nos', rate: 12500 },
            { itemName: 'Networking & Electrical Data', quantity: 20, unit: 'Points', rate: 2500 },
            { itemName: 'Office Cabin Table', quantity: 2, unit: 'Nos', rate: 25000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Gypsum Partitions', quantity: 500, unit: 'Sq.ft', rate: 350 },
                { itemName: 'Grid False Ceiling', quantity: 1500, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Vinyl Flooring', quantity: 1500, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Workstations (Basic)', quantity: 20, unit: 'Nos', rate: 8500 },
                { itemName: 'Networking & Electrical', quantity: 20, unit: 'Points', rate: 1800 },
                { itemName: 'Office Furniture (Basic)', quantity: 2, unit: 'Nos', rate: 15000 }
            ],
            standard: [
                { itemName: 'Glass Partitions (8mm)', quantity: 500, unit: 'Sq.ft', rate: 550 },
                { itemName: 'Grid False Ceiling (2x2)', quantity: 1500, unit: 'Sq.ft', rate: 75 },
                { itemName: 'Carpet Tile Flooring', quantity: 1500, unit: 'Sq.ft', rate: 140 },
                { itemName: 'Workstations (Modular)', quantity: 20, unit: 'Nos', rate: 12500 },
                { itemName: 'Networking & Data Points', quantity: 20, unit: 'Points', rate: 2500 },
                { itemName: 'Office Cabin Table', quantity: 2, unit: 'Nos', rate: 25000 }
            ],
            premium: [
                { itemName: 'Glass Partitions (12mm Toughened)', quantity: 500, unit: 'Sq.ft', rate: 850 },
                { itemName: 'Designer False Ceiling', quantity: 1500, unit: 'Sq.ft', rate: 115 },
                { itemName: 'Premium Carpet Tiles', quantity: 1500, unit: 'Sq.ft', rate: 220 },
                { itemName: 'Executive Workstations', quantity: 20, unit: 'Nos', rate: 18500 },
                { itemName: 'Smart Networking & Automation', quantity: 20, unit: 'Points', rate: 3500 },
                { itemName: 'Executive Cabin Furniture', quantity: 2, unit: 'Nos', rate: 45000 }
            ]
        }
    },
    {
        id: 'commercial-showroom',
        name: 'Commercial - Showroom',
        description: 'Retail showroom with premium display and lighting.',
        items: [
            { itemName: 'Full Height Glass Frontage', quantity: 300, unit: 'Sq.ft', rate: 1200 },
            { itemName: 'Italian/GVT Flooring (4x2)', quantity: 1000, unit: 'Sq.ft', rate: 250 },
            { itemName: 'Track Lighting & Focus Lights', quantity: 50, unit: 'Nos', rate: 2200 },
            { itemName: 'Display Racks & Shelving', quantity: 1, unit: 'Lump Sum', rate: 150000 },
            { itemName: 'AC Ducting & Piping', quantity: 1, unit: 'Lump Sum', rate: 85000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Glass Frontage (8mm)', quantity: 300, unit: 'Sq.ft', rate: 800 },
                { itemName: 'Vitrified Flooring', quantity: 1000, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Basic Lighting', quantity: 50, unit: 'Nos', rate: 800 },
                { itemName: 'Display Racks (Basic)', quantity: 1, unit: 'Lump Sum', rate: 85000 },
                { itemName: 'AC Piping', quantity: 1, unit: 'Lump Sum', rate: 45000 }
            ],
            standard: [
                { itemName: 'Full Height Glass Frontage', quantity: 300, unit: 'Sq.ft', rate: 1200 },
                { itemName: 'Italian/GVT Flooring (4x2)', quantity: 1000, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Track Lighting & Focus Lights', quantity: 50, unit: 'Nos', rate: 2200 },
                { itemName: 'Display Racks & Shelving', quantity: 1, unit: 'Lump Sum', rate: 150000 },
                { itemName: 'AC Ducting & Piping', quantity: 1, unit: 'Lump Sum', rate: 85000 }
            ],
            premium: [
                { itemName: 'Frameless Glass Facade', quantity: 300, unit: 'Sq.ft', rate: 1800 },
                { itemName: 'Italian Marble Flooring', quantity: 1000, unit: 'Sq.ft', rate: 450 },
                { itemName: 'Designer Lighting', quantity: 50, unit: 'Nos', rate: 4500 },
                { itemName: 'Premium Display Units', quantity: 1, unit: 'Lump Sum', rate: 250000 },
                { itemName: 'Centralized AC System', quantity: 1, unit: 'Lump Sum', rate: 180000 }
            ]
        }
    },
    {
        id: 'commercial-restaurant',
        name: 'Commercial - Restaurant/Cafe',
        description: 'Restaurant setup including kitchen and dining area.',
        items: [
            { itemName: 'Kitchen Stainless Steel Fabrication', quantity: 1, unit: 'Lump Sum', rate: 250000 },
            { itemName: 'Gas Pipeline & Exhaust System', quantity: 1, unit: 'Lump Sum', rate: 120000 },
            { itemName: 'Custom Seating & Furniture', quantity: 40, unit: 'Nos', rate: 8500 },
            { itemName: 'Ambient Lighting & Decor', quantity: 1, unit: 'Lump Sum', rate: 95000 },
            { itemName: 'Non-slip Kitchen Flooring', quantity: 400, unit: 'Sq.ft', rate: 110 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Kitchen SS Fabrication (Basic)', quantity: 1, unit: 'Lump Sum', rate: 150000 },
                { itemName: 'Gas Pipeline & Exhaust', quantity: 1, unit: 'Lump Sum', rate: 75000 },
                { itemName: 'Standard Seating & Furniture', quantity: 40, unit: 'Nos', rate: 4500 },
                { itemName: 'Basic Lighting', quantity: 1, unit: 'Lump Sum', rate: 45000 },
                { itemName: 'Anti-slip Kitchen Flooring', quantity: 400, unit: 'Sq.ft', rate: 85 }
            ],
            standard: [
                { itemName: 'Kitchen Stainless Steel Fabrication', quantity: 1, unit: 'Lump Sum', rate: 250000 },
                { itemName: 'Gas Pipeline & Exhaust System', quantity: 1, unit: 'Lump Sum', rate: 120000 },
                { itemName: 'Custom Seating & Furniture', quantity: 40, unit: 'Nos', rate: 8500 },
                { itemName: 'Ambient Lighting & Decor', quantity: 1, unit: 'Lump Sum', rate: 95000 },
                { itemName: 'Non-slip Kitchen Flooring', quantity: 400, unit: 'Sq.ft', rate: 110 }
            ],
            premium: [
                { itemName: 'Premium Kitchen SS Fabrication', quantity: 1, unit: 'Lump Sum', rate: 380000 },
                { itemName: 'Advanced Gas & Ventilation', quantity: 1, unit: 'Lump Sum', rate: 180000 },
                { itemName: 'Designer Seating & Imported Furniture', quantity: 40, unit: 'Nos', rate: 15000 },
                { itemName: 'Designer Lighting & Theme Decor', quantity: 1, unit: 'Lump Sum', rate: 175000 },
                { itemName: 'Premium Anti-slip Flooring', quantity: 400, unit: 'Sq.ft', rate: 185 }
            ]
        }
    },
    {
        id: 'renovation-work',
        name: 'Renovation - Full Home',
        description: 'Complete home renovation package.',
        items: [],
        qualityVariants: {
            basic: [
                { itemName: 'Wall Repair & Patching', quantity: 1000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Scraping Old Paint', quantity: 2000, unit: 'Sq.ft', rate: 8 },
                { itemName: 'Basic Putty (1 Coat)', quantity: 2000, unit: 'Sq.ft', rate: 12 },
                { itemName: 'Emulsion Paint', quantity: 2000, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Basic Electrical Repairs', quantity: 1, unit: 'Lump Sum', rate: 15000 },
                { itemName: 'Basic Plumbing Fixes', quantity: 1, unit: 'Lump Sum', rate: 12000 }
            ],
            standard: [
                { itemName: 'Wall Repair & Replastering', quantity: 1000, unit: 'Sq.ft', rate: 55 },
                { itemName: 'Scraping Existing Paint', quantity: 2000, unit: 'Sq.ft', rate: 8 },
                { itemName: 'Birla Putty (2 Coats)', quantity: 2000, unit: 'Sq.ft', rate: 18 },
                { itemName: 'Premium Emulsion Paint', quantity: 2000, unit: 'Sq.ft', rate: 38 },
                { itemName: 'Electrical Rewiring & Upgrades', quantity: 1, unit: 'Lump Sum', rate: 35000 },
                { itemName: 'Plumbing Replacement', quantity: 1, unit: 'Lump Sum', rate: 28000 }
            ],
            premium: [
                { itemName: 'Complete Wall Replastering', quantity: 1000, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Surface Preparation', quantity: 2000, unit: 'Sq.ft', rate: 12 },
                { itemName: 'Premium Putty (3 Coats)', quantity: 2000, unit: 'Sq.ft', rate: 28 },
                { itemName: 'Designer Paint + Texture', quantity: 2000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Complete Electrical Overhaul + Smart', quantity: 1, unit: 'Lump Sum', rate: 75000 },
                { itemName: 'Premium Plumbing Replacement', quantity: 1, unit: 'Lump Sum', rate: 55000 }
            ]
        }
    },
    {
        id: 'industrial-warehouse',
        name: 'Industrial - Warehouse/Godown',
        description: 'PEB structure and VDF flooring for storage.',
        items: [
            { itemName: 'PEB Structural Steel Work', quantity: 15000, unit: 'Kg', rate: 85 },
            { itemName: 'Galvalume Roofing Sheets', quantity: 5000, unit: 'Sq.ft', rate: 65 },
            { itemName: 'Trimix/VDF Flooring (M25)', quantity: 5000, unit: 'Sq.ft', rate: 95 },
            { itemName: 'Turbo Ventilators', quantity: 10, unit: 'Nos', rate: 4500 },
            { itemName: 'Rolling Shutters (Motorized)', quantity: 2, unit: 'Nos', rate: 35000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'PEB Structural Steel Work', quantity: 15000, unit: 'Kg', rate: 75 },
                { itemName: 'Galvalume Roofing Sheets', quantity: 5000, unit: 'Sq.ft', rate: 55 },
                { itemName: 'IPS Flooring', quantity: 5000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Turbo Ventilators', quantity: 10, unit: 'Nos', rate: 3500 },
                { itemName: 'Manual Rolling Shutters', quantity: 2, unit: 'Nos', rate: 18000 }
            ],
            standard: [
                { itemName: 'PEB Structural Steel Work', quantity: 15000, unit: 'Kg', rate: 85 },
                { itemName: 'Galvalume Roofing Sheets', quantity: 5000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Trimix/VDF Flooring (M25)', quantity: 5000, unit: 'Sq.ft', rate: 95 },
                { itemName: 'Turbo Ventilators', quantity: 10, unit: 'Nos', rate: 4500 },
                { itemName: 'Rolling Shutters (Motorized)', quantity: 2, unit: 'Nos', rate: 35000 }
            ],
            premium: [
                { itemName: 'Heavy PEB Structure', quantity: 15000, unit: 'Kg', rate: 110 },
                { itemName: 'Insulated Puff Sheets', quantity: 5000, unit: 'Sq.ft', rate: 180 },
                { itemName: 'Epoxy Coated VDF Flooring', quantity: 5000, unit: 'Sq.ft', rate: 180 },
                { itemName: 'Power Driven Ventilators', quantity: 10, unit: 'Nos', rate: 8500 },
                { itemName: 'High Speed Rolling Shutters', quantity: 2, unit: 'Nos', rate: 85000 }
            ]
        }
    },

    // =========================================================================
    // 🛠️ WORK-SPECIFIC ESTIMATES
    // =========================================================================
    {
        id: 'plastering-painting',
        name: 'Plastering & Painting Services',
        description: 'Internal gypsum/putty and external weather coat.',
        items: [
            { itemName: 'Scraping Existing Paint', quantity: 2000, unit: 'Sq.ft', rate: 8 },
            { itemName: 'Birla Putty (2 Coats)', quantity: 2000, unit: 'Sq.ft', rate: 18 },
            { itemName: 'Primer Application', quantity: 2000, unit: 'Sq.ft', rate: 12 },
            { itemName: 'Royal Emulsion Paint', quantity: 2000, unit: 'Sq.ft', rate: 32 },
            { itemName: 'Texture Paint (Highlight Wall)', quantity: 200, unit: 'Sq.ft', rate: 120 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Scraping', quantity: 2000, unit: 'Sq.ft', rate: 6 },
                { itemName: 'Standard Putty (1 Coat)', quantity: 2000, unit: 'Sq.ft', rate: 10 },
                { itemName: 'Primer', quantity: 2000, unit: 'Sq.ft', rate: 10 },
                { itemName: 'Tractor Emulsion', quantity: 2000, unit: 'Sq.ft', rate: 22 },
                { itemName: 'Basic Texture', quantity: 200, unit: 'Sq.ft', rate: 85 }
            ],
            standard: [
                { itemName: 'Scraping Existing Paint', quantity: 2000, unit: 'Sq.ft', rate: 8 },
                { itemName: 'Birla Putty (2 Coats)', quantity: 2000, unit: 'Sq.ft', rate: 18 },
                { itemName: 'Primer Application', quantity: 2000, unit: 'Sq.ft', rate: 12 },
                { itemName: 'Royal Emulsion Paint', quantity: 2000, unit: 'Sq.ft', rate: 32 },
                { itemName: 'Texture Paint (Highlight Wall)', quantity: 200, unit: 'Sq.ft', rate: 120 }
            ],
            premium: [
                { itemName: 'Mechanized Sanding', quantity: 2000, unit: 'Sq.ft', rate: 12 },
                { itemName: 'Premium Acrylic Putty (3 Coats)', quantity: 2000, unit: 'Sq.ft', rate: 28 },
                { itemName: 'Premium Primer', quantity: 2000, unit: 'Sq.ft', rate: 15 },
                { itemName: 'Royale Aspira/Velvet Paint', quantity: 2000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Signature Texture Finish', quantity: 200, unit: 'Sq.ft', rate: 180 }
            ]
        }
    },
    {
        id: 'flooring-tiling',
        name: 'Flooring & Tiling Work',
        description: 'Removal and laying of new tiles.',
        items: [
            { itemName: 'Removing Old Flooring', quantity: 800, unit: 'Sq.ft', rate: 25 },
            { itemName: 'Floor Levelling (Screed)', quantity: 800, unit: 'Sq.ft', rate: 45 },
            { itemName: 'Vitrified Tiles (800x800)', quantity: 800, unit: 'Sq.ft', rate: 110 },
            { itemName: 'Tile Fixing with Chemical', quantity: 800, unit: 'Sq.ft', rate: 35 },
            { itemName: 'Skirting Running Feet', quantity: 150, unit: 'Running ft', rate: 45 },
            { itemName: 'Epoxy Grouting', quantity: 800, unit: 'Sq.ft', rate: 15 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Removing Old Flooring', quantity: 800, unit: 'Sq.ft', rate: 20 },
                { itemName: 'Floor Levelling', quantity: 800, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Ceramic Tiles (12x12)', quantity: 800, unit: 'Sq.ft', rate: 55 },
                { itemName: 'Cement Mortar Fixing', quantity: 800, unit: 'Sq.ft', rate: 25 },
                { itemName: 'White Cement Grout', quantity: 800, unit: 'Sq.ft', rate: 8 },
                { itemName: 'Skirting', quantity: 150, unit: 'Running ft', rate: 35 }
            ],
            standard: [
                { itemName: 'Removing Old Flooring', quantity: 800, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Floor Levelling (Screed)', quantity: 800, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Vitrified Tiles (800x800)', quantity: 800, unit: 'Sq.ft', rate: 110 },
                { itemName: 'Tile Fixing with Chemical', quantity: 800, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Epoxy Grouting', quantity: 800, unit: 'Sq.ft', rate: 15 },
                { itemName: 'Skirting Running Feet', quantity: 150, unit: 'Running ft', rate: 45 }
            ],
            premium: [
                { itemName: 'Removing with Breakers', quantity: 800, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Self Leveling Compound', quantity: 800, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Italian Marble / GVT (4x2)', quantity: 800, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Premium Adhesive (Laticrete)', quantity: 800, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Epoxy & Sparkle Grout', quantity: 800, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Moulded Skirting', quantity: 150, unit: 'Running ft', rate: 120 }
            ]
        }
    },
    {
        id: 'electrical-fitting',
        name: 'Electrical Fitting & Wiring',
        description: 'Complete electrical point wiring and switchgear.',
        items: [
            { itemName: 'Wall Chasing & Conduit Laying', quantity: 500, unit: 'Running ft', rate: 65 },
            { itemName: 'Wiring (Polycab/Havells)', quantity: 40, unit: 'Points', rate: 850 },
            { itemName: 'Modular Switch Plates (Legrand)', quantity: 15, unit: 'Nos', rate: 450 },
            { itemName: 'MCB DB Installation', quantity: 1, unit: 'Nos', rate: 3500 },
            { itemName: 'Light Fixture Installation', quantity: 20, unit: 'Nos', rate: 150 },
            { itemName: 'Inverter Wiring Provision', quantity: 1, unit: 'Lump Sum', rate: 3500 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'PVC Casing capping / Conduit', quantity: 500, unit: 'Running ft', rate: 45 },
                { itemName: 'Standard Wiring (Anchor)', quantity: 40, unit: 'Points', rate: 650 },
                { itemName: 'Piano/Basic Switches', quantity: 15, unit: 'Nos', rate: 250 },
                { itemName: 'Standard DB', quantity: 1, unit: 'Nos', rate: 2500 },
                { itemName: 'Holder & Rose Installation', quantity: 20, unit: 'Nos', rate: 85 },
                { itemName: 'Main Line Connection', quantity: 1, unit: 'Lump Sum', rate: 2500 }
            ],
            standard: [
                { itemName: 'Wall Chasing & Conduit Laying', quantity: 500, unit: 'Running ft', rate: 65 },
                { itemName: 'Wiring (Polycab/Havells)', quantity: 40, unit: 'Points', rate: 850 },
                { itemName: 'Modular Switch Plates (Legrand)', quantity: 15, unit: 'Nos', rate: 450 },
                { itemName: 'MCB DB Installation', quantity: 1, unit: 'Nos', rate: 3500 },
                { itemName: 'Light Fixture Installation', quantity: 20, unit: 'Nos', rate: 150 },
                { itemName: 'Inverter Wiring Provision', quantity: 1, unit: 'Lump Sum', rate: 3500 }
            ],
            premium: [
                { itemName: 'Heavy Duty Conduit (HMS)', quantity: 500, unit: 'Running ft', rate: 85 },
                { itemName: 'FRLS Wiring (Finolex Gold)', quantity: 40, unit: 'Points', rate: 1250 },
                { itemName: 'Touch/Glass Plates (Schneider)', quantity: 15, unit: 'Nos', rate: 1800 },
                { itemName: 'Distribution Board (VTPN)', quantity: 1, unit: 'Nos', rate: 8500 },
                { itemName: 'Chandelier/Profile Installation', quantity: 20, unit: 'Nos', rate: 450 },
                { itemName: 'Home Automation Wiring', quantity: 1, unit: 'Lump Sum', rate: 15000 }
            ]
        }
    },
    {
        id: 'plumbing-sanitation',
        name: 'Plumbing & Sanitation Works',
        description: 'Bathroom piping and sanitary ware installation.',
        items: [
            { itemName: 'Concealed CPVC Piping (Astral)', quantity: 2, unit: 'Bathrooms', rate: 15000 },
            { itemName: 'SWR Drainage Pipeline', quantity: 100, unit: 'Running ft', rate: 180 },
            { itemName: 'Diverter Installation', quantity: 2, unit: 'Nos', rate: 2500 },
            { itemName: 'Wall Hung WC Installation', quantity: 2, unit: 'Nos', rate: 3500 },
            { itemName: 'Wash Basin Installation', quantity: 2, unit: 'Nos', rate: 1200 },
            { itemName: 'Overhead Tank (1000L)', quantity: 1, unit: 'Nos', rate: 8500 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'PVC Internal Piping', quantity: 2, unit: 'Bathrooms', rate: 8500 },
                { itemName: 'PVC Drainage', quantity: 100, unit: 'Running ft', rate: 120 },
                { itemName: 'Wall Mixer Taps', quantity: 2, unit: 'Nos', rate: 1500 },
                { itemName: 'Indian/Floor Mount WC', quantity: 2, unit: 'Nos', rate: 1800 },
                { itemName: 'Corner Basin', quantity: 2, unit: 'Nos', rate: 850 },
                { itemName: 'Standard Tank (500L)', quantity: 1, unit: 'Nos', rate: 4500 }
            ],
            standard: [
                { itemName: 'Concealed CPVC Piping (Astral)', quantity: 2, unit: 'Bathrooms', rate: 15000 },
                { itemName: 'SWR Drainage Pipeline', quantity: 100, unit: 'Running ft', rate: 180 },
                { itemName: 'Diverter Installation', quantity: 2, unit: 'Nos', rate: 2500 },
                { itemName: 'Wall Hung WC Installation', quantity: 2, unit: 'Nos', rate: 3500 },
                { itemName: 'Wash Basin Installation', quantity: 2, unit: 'Nos', rate: 1200 },
                { itemName: 'Overhead Tank (1000L)', quantity: 1, unit: 'Nos', rate: 8500 }
            ],
            premium: [
                { itemName: 'Composite/PPR Piping', quantity: 2, unit: 'Bathrooms', rate: 25000 },
                { itemName: 'Low Noise Drainage (Silent)', quantity: 100, unit: 'Running ft', rate: 350 },
                { itemName: 'Thermostatic Diversity', quantity: 2, unit: 'Nos', rate: 8500 },
                { itemName: 'Automatic/Smart WC', quantity: 2, unit: 'Nos', rate: 8500 },
                { itemName: 'Counter Top Basin (Stone)', quantity: 2, unit: 'Nos', rate: 3500 },
                { itemName: 'Pressure Pump System', quantity: 1, unit: 'Nos', rate: 25000 }
            ]
        }
    },
    {
        id: 'carpentry-woodwork',
        name: 'Carpentry & Woodwork',
        description: 'Furniture framing, plywood work, and finishing.',
        items: [
            { itemName: 'Plywood Wardrobe Structure', quantity: 200, unit: 'Sq.ft', rate: 950 },
            { itemName: 'Laminate Pasting (1mm)', quantity: 200, unit: 'Sq.ft', rate: 120 },
            { itemName: 'TV Unit Fabrication', quantity: 50, unit: 'Sq.ft', rate: 1200 },
            { itemName: 'Hardware & Fittings (Hettich)', quantity: 1, unit: 'Lump Sum', rate: 25000 },
            { itemName: 'Safety Door (Teak Finish)', quantity: 1, unit: 'Nos', rate: 35000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Particle Board Wardrobe', quantity: 200, unit: 'Sq.ft', rate: 650 },
                { itemName: 'Standard Laminate (0.8mm)', quantity: 200, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Basic TV Unit', quantity: 50, unit: 'Sq.ft', rate: 850 },
                { itemName: 'Standard Fittings (Ebco)', quantity: 1, unit: 'Lump Sum', rate: 15000 },
                { itemName: 'Flush Door (Painted)', quantity: 1, unit: 'Nos', rate: 8500 }
            ],
            standard: [
                { itemName: 'Plywood Wardrobe Structure', quantity: 200, unit: 'Sq.ft', rate: 950 },
                { itemName: 'Laminate Pasting (1mm)', quantity: 200, unit: 'Sq.ft', rate: 120 },
                { itemName: 'TV Unit Fabrication', quantity: 50, unit: 'Sq.ft', rate: 1200 },
                { itemName: 'Hardware & Fittings (Hettich)', quantity: 1, unit: 'Lump Sum', rate: 25000 },
                { itemName: 'Safety Door (Teak Finish)', quantity: 1, unit: 'Nos', rate: 35000 }
            ],
            premium: [
                { itemName: 'Marine Ply (Gurjan)', quantity: 200, unit: 'Sq.ft', rate: 1450 },
                { itemName: 'Veneer / PU Polish', quantity: 200, unit: 'Sq.ft', rate: 350 },
                { itemName: 'Designer TV Console (Stone)', quantity: 50, unit: 'Sq.ft', rate: 2500 },
                { itemName: 'Soft Close Fittings (Blum)', quantity: 1, unit: 'Lump Sum', rate: 45000 },
                { itemName: 'Teak Wood Main Door', quantity: 1, unit: 'Nos', rate: 65000 }
            ]
        }
    },
    {
        id: 'false-ceiling',
        name: 'False Ceiling (POP/Gypsum)',
        description: 'Suspended ceiling work with framing.',
        items: [
            { itemName: 'GI Channel Framing', quantity: 1000, unit: 'Sq.ft', rate: 45 },
            { itemName: 'Gypsum Board Fixing (Saint Gobain)', quantity: 1000, unit: 'Sq.ft', rate: 40 },
            { itemName: 'POP Punning & Finishing', quantity: 1000, unit: 'Sq.ft', rate: 25 },
            { itemName: 'Cove Light Provision', quantity: 200, unit: 'Running ft', rate: 35 },
            { itemName: 'Cutting for Lights/AC', quantity: 20, unit: 'Nos', rate: 50 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Basic Grid / POP Border', quantity: 1000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Standard Gypsum Board', quantity: 1000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Joint Finishing', quantity: 1000, unit: 'Sq.ft', rate: 15 },
                { itemName: 'Basic Cutouts', quantity: 10, unit: 'Nos', rate: 35 }
            ],
            standard: [
                { itemName: 'GI Channel Framing', quantity: 1000, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Gypsum Board Fixing (Saint Gobain)', quantity: 1000, unit: 'Sq.ft', rate: 40 },
                { itemName: 'POP Punning & Finishing', quantity: 1000, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Cove Light Provision', quantity: 200, unit: 'Running ft', rate: 35 },
                { itemName: 'Cutting for Lights/AC', quantity: 20, unit: 'Nos', rate: 50 }
            ],
            premium: [
                { itemName: 'Double Framing Structure', quantity: 1000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Moisture Resistant Gypsum', quantity: 1000, unit: 'Sq.ft', rate: 55 },
                { itemName: 'Premium POP Smooth Finish', quantity: 1000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Profile Light Channeling', quantity: 200, unit: 'Running ft', rate: 85 },
                { itemName: 'Wooden/Rafter Highlights', quantity: 100, unit: 'Sq.ft', rate: 250 }
            ]
        }
    },
    {
        id: 'waterproofing',
        name: 'Terrace/Bathroom Waterproofing',
        description: 'Chemical and brickbat waterproofing solutions.',
        items: [
            { itemName: 'Surface Cleaning & Crack Filling', quantity: 1000, unit: 'Sq.ft', rate: 15 },
            { itemName: 'Brickbat Coba Waterproofing', quantity: 1000, unit: 'Sq.ft', rate: 110 },
            { itemName: 'Dr. Fixit Chemical Coating (2 Coats)', quantity: 1000, unit: 'Sq.ft', rate: 35 },
            { itemName: 'China Mosaic Finishing', quantity: 1000, unit: 'Sq.ft', rate: 85 },
            { itemName: 'Grouting & Slope Adjustment', quantity: 1, unit: 'Lump Sum', rate: 15000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Surface Cleaning', quantity: 1000, unit: 'Sq.ft', rate: 10 },
                { itemName: 'Cement Slurry Coat', quantity: 1000, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Brickbat Coba', quantity: 1000, unit: 'Sq.ft', rate: 95 },
                { itemName: 'IPS Finish', quantity: 1000, unit: 'Sq.ft', rate: 45 }
            ],
            standard: [
                { itemName: 'Surface Cleaning & Crack Filling', quantity: 1000, unit: 'Sq.ft', rate: 15 },
                { itemName: 'Brickbat Coba Waterproofing', quantity: 1000, unit: 'Sq.ft', rate: 110 },
                { itemName: 'Dr. Fixit Chemical Coating (2 Coats)', quantity: 1000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'China Mosaic Finishing', quantity: 1000, unit: 'Sq.ft', rate: 85 }
            ],
            premium: [
                { itemName: 'Surface Blasting/Breeding', quantity: 1000, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Polyurethane (PU) Coating', quantity: 1000, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Fiber Mesh Reinforcement', quantity: 1000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Thermal Insulation Tiles', quantity: 1000, unit: 'Sq.ft', rate: 150 },
                { itemName: '10 Year Warranty System', quantity: 1, unit: 'Lump Sum', rate: 25000 }
            ]
        }
    },

    // =========================================================================
    // ✨ SPECIALIZED PROJECTS
    // =========================================================================
    {
        id: 'swimming-pool',
        name: 'Swimming Pool Construction',
        description: 'Civil and filtration works for swimming pool.',
        items: [
            { itemName: 'Excavation for Pool', quantity: 3000, unit: 'Cubic ft', rate: 18 },
            { itemName: 'RCC Retaining Wall (M30 Waterproof)', quantity: 1200, unit: 'Cubic ft', rate: 750 },
            { itemName: 'Pool Tiling (Glass Mosaic)', quantity: 800, unit: 'Sq.ft', rate: 250 },
            { itemName: 'Filtration Plant System', quantity: 1, unit: 'Set', rate: 150000 },
            { itemName: 'Underwater Lighting', quantity: 4, unit: 'Nos', rate: 8500 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Excavation', quantity: 3000, unit: 'Cubic ft', rate: 15 },
                { itemName: 'RCC Wall (M25)', quantity: 1200, unit: 'Cubic ft', rate: 650 },
                { itemName: 'Ceramic Pool Tiles', quantity: 800, unit: 'Sq.ft', rate: 120 },
                { itemName: 'Cartridge Filter Basic', quantity: 1, unit: 'Set', rate: 85000 },
                { itemName: 'Basic Pool Light', quantity: 2, unit: 'Nos', rate: 4500 }
            ],
            standard: [
                { itemName: 'Excavation for Pool', quantity: 3000, unit: 'Cubic ft', rate: 18 },
                { itemName: 'RCC Retaining Wall (M30 Waterproof)', quantity: 1200, unit: 'Cubic ft', rate: 750 },
                { itemName: 'Pool Tiling (Glass Mosaic)', quantity: 800, unit: 'Sq.ft', rate: 250 },
                { itemName: 'Filtration Plant System', quantity: 1, unit: 'Set', rate: 150000 },
                { itemName: 'Underwater Lighting', quantity: 4, unit: 'Nos', rate: 8500 }
            ],
            premium: [
                { itemName: 'Guniting/Shotcrete Work', quantity: 1200, unit: 'Cubic ft', rate: 950 },
                { itemName: 'Designer Glass Mosaic (Imported)', quantity: 800, unit: 'Sq.ft', rate: 450 },
                { itemName: 'Ozonation + Sand  Filter Plant', quantity: 1, unit: 'Set', rate: 280000 },
                { itemName: 'Counter Current System', quantity: 1, unit: 'Set', rate: 120000 },
                { itemName: 'RGB LED Synchronization', quantity: 6, unit: 'Nos', rate: 12500 }
            ]
        }
    },
    {
        id: 'landscape-garden',
        name: 'Landscape & Garden Development',
        description: 'Landscaping, grass lawns, and hardscaping.',
        items: [
            { itemName: 'Red Soil Filling & Levelling', quantity: 2000, unit: 'Cubic ft', rate: 25 },
            { itemName: 'Mexican Lawn Grass Carpet', quantity: 1000, unit: 'Sq.ft', rate: 45 },
            { itemName: 'Palm Trees (10ft height)', quantity: 5, unit: 'Nos', rate: 4500 },
            { itemName: 'Stone Pathway (Kota/Granite)', quantity: 300, unit: 'Sq.ft', rate: 180 },
            { itemName: 'Drip Irrigation System', quantity: 1, unit: 'Lump Sum', rate: 35000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Soil Filling', quantity: 2000, unit: 'Cubic ft', rate: 20 },
                { itemName: 'Local Grass Selection', quantity: 1000, unit: 'Sq.ft', rate: 25 },
                { itemName: 'Small Shrubs/Plants', quantity: 20, unit: 'Nos', rate: 250 },
                { itemName: 'Concrete Pavers', quantity: 300, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Manual Watering Points', quantity: 5, unit: 'Points', rate: 1500 }
            ],
            standard: [
                { itemName: 'Red Soil Filling & Levelling', quantity: 2000, unit: 'Cubic ft', rate: 25 },
                { itemName: 'Mexican Lawn Grass Carpet', quantity: 1000, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Palm Trees (10ft height)', quantity: 5, unit: 'Nos', rate: 4500 },
                { itemName: 'Stone Pathway (Kota/Granite)', quantity: 300, unit: 'Sq.ft', rate: 180 },
                { itemName: 'Drip Irrigation System', quantity: 1, unit: 'Lump Sum', rate: 35000 }
            ],
            premium: [
                { itemName: 'Enriched Soil Mix', quantity: 2000, unit: 'Cubic ft', rate: 45 },
                { itemName: 'American Blue Grass', quantity: 1000, unit: 'Sq.ft', rate: 85 },
                { itemName: 'Exotic Trees & Bonsai', quantity: 5, unit: 'Nos', rate: 15000 },
                { itemName: 'Wooden Deck / Gazebo', quantity: 1, unit: 'Lump Sum', rate: 150000 },
                { itemName: 'Automated Sprinkler System', quantity: 1, unit: 'Lump Sum', rate: 85000 }
            ]
        }
    },
    {
        id: 'demolition-work',
        name: 'Demolition Work',
        description: 'Breaking of RCC/Brick structures and disposal.',
        items: [
            { itemName: 'RCC Slab Demolition', quantity: 1000, unit: 'Sq.ft', rate: 45 },
            { itemName: 'Brick Wall Demolition', quantity: 500, unit: 'Cubic ft', rate: 25 },
            { itemName: 'Debris Loading & Carting', quantity: 10, unit: 'Truck Loads', rate: 3500 },
            { itemName: 'Site Clearance & Cleaning', quantity: 1, unit: 'Lump Sum', rate: 15000 }
        ],
        qualityVariants: {
            basic: [
                { itemName: 'Manual Breaking (Labour)', quantity: 1000, unit: 'Sq.ft', rate: 35 },
                { itemName: 'Wall Demolition', quantity: 500, unit: 'Cubic ft', rate: 20 },
                { itemName: 'Debris Disposal (Tractor)', quantity: 15, unit: 'Trips', rate: 1500 },
                { itemName: 'Basic Cleaning', quantity: 1, unit: 'Lump Sum', rate: 8000 }
            ],
            standard: [
                { itemName: 'RCC Slab Demolition', quantity: 1000, unit: 'Sq.ft', rate: 45 },
                { itemName: 'Brick Wall Demolition', quantity: 500, unit: 'Cubic ft', rate: 25 },
                { itemName: 'Debris Loading & Carting', quantity: 10, unit: 'Truck Loads', rate: 3500 },
                { itemName: 'Site Clearance & Cleaning', quantity: 1, unit: 'Lump Sum', rate: 15000 }
            ],
            premium: [
                { itemName: 'Mechanical Breaking (Hilti)', quantity: 1000, unit: 'Sq.ft', rate: 65 },
                { itemName: 'Diamond Concrete Cutting', quantity: 200, unit: 'Running ft', rate: 450 },
                { itemName: 'Dust Free Disposal', quantity: 1, unit: 'Lump Sum', rate: 65000 },
                { itemName: 'Salvage Recovery', quantity: 1, unit: 'Lump Sum', rate: 5000 }
            ]
        }
    }
];
