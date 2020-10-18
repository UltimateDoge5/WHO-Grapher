// country list

const countriesObject = {
    "Afghanistan": "AFG",
    "Albania": "ALB",
    "Algeria": "DZA",
    "American Samoa": "ASM",
    "Andorra": "AND",
    "Angola": "AGO",
    "Anguilla": "AIA",
    "Antarctica": "ATA",
    "Antigua & Barbuda": "ATG",
    "Argentina": "ARG",
    "Armenia": "ARM",
    "Aruba": "ABW",
    "Australia": "AUS",
    "Austria": "AUT",
    "Azerbaijan": "AZE",
    "Bahamas": "BHS",
    "Bahrain": "BHR",
    "Bangladesh": "BGD",
    "Barbados": "BRB",
    "Belarus": "BLR",
    "Belgium": "BEL",
    "Belize": "BLZ",
    "Benin": "BEN",
    "Bermuda": "BMU",
    "Bhutan": "BTN",
    "Bolivia": "BOL",
    "Bosnia & Herzegovina": "BIH",
    "Botswana": "BWA",
    "Bouvet Island": "BVT",
    "Brazil": "BRA",
    "British Indian Ocean Territory": "IOT",
    "British Virgin Islands": "VGB",
    "Brunei": "BRN",
    "Bulgaria": "BGR",
    "Burkina Faso": "BFA",
    "Burundi": "BDI",
    "Cambodia": "KHM",
    "Cameroon": "CMR",
    "Canada": "CAN",
    "Cape Verde": "CPV",
    "Cayman Islands": "CYM",
    "Central African Republic": "CAF",
    "Chad": "TCD",
    "Chile": "CHL",
    "China": "CHN",
    "Christmas Island": "CXR",
    "Cocos Islands": "CCK",
    "Colombia": "COL",
    "Comoros": "COM",
    "Cook Islands": "COK",
    "Costa Rica": "CRI",
    "Croatia": "HRV",
    "Cuba": "CUB",
    "Curaçao": "CUW",
    "Cyprus": "CYP",
    "Czechia": "CZE",
    "Republic of the Congo": "COG",
    "Denmark": "DNK",
    "Djibouti": "DJI",
    "Dominica": "DMA",
    "Dominican Republic": "DOM",
    "Ecuador": "ECU",
    "Egypt": "EGY",
    "El Salvador": "SLV",
    "Equatorial Guinea": "GNQ",
    "Eritrea": "ERI",
    "Estonia": "EST",
    "Ethiopia": "ETH",
    "Falkland Islands": "FLK",
    "Faroe Islands": "FRO",
    "Fiji": "FJI",
    "Finland": "FIN",
    "France": "FRA",
    "French Guiana": "GUF",
    "French Polynesia": "PYF",
    "French Southern Territories": "ATF",
    "Gabon": "GAB",
    "Gambia": "GMB",
    "Georgia": "GEO",
    "Germany": "DEU",
    "Ghana": "GHA",
    "Gibraltar": "GIB",
    "Greece": "GRC",
    "Greenland": "GRL",
    "Grenada": "GRD",
    "Guadeloupe": "GLP",
    "Guam": "GUM",
    "Guatemala": "GTM",
    "Guernsey": "GGY",
    "Guinea": "GIN",
    "Guinea-Bissau": "GNB",
    "Guyana": "GUY",
    "Haiti": "HTI",
    "Heard & McDonald Islands": "HMD",
    "Honduras": "HND",
    "Hong Kong": "HKG",
    "Hungary": "HUN",
    "Iceland": "ISL",
    "India": "IND",
    "Indonesia": "IDN",
    "Iran": "IRN",
    "Iraq": "IRQ",
    "Ireland": "IRL",
    "Isle of Man": "IMN",
    "Israel": "ISR",
    "Italy": "ITA",
    "Jamaica": "JAM",
    "Japan": "JPN",
    "Jersey": "JEY",
    "Jordan": "JOR",
    "Kazakhstan": "KAZ",
    "Kenya": "KEN",
    "Kiribati": "KIR",
    "Kosovo": "XXK",
    "Kuwait": "KWT",
    "Kyrgyzstan": "KGZ",
    "Laos": "LAO",
    "Latvia": "LVA",
    "Lebanon": "LBN",
    "Lesotho": "LSO",
    "Liberia": "LBR",
    "Libya": "LBY",
    "Liechtenstein": "LIE",
    "Lithuania": "LTU",
    "Luxembourg": "LUX",
    "Macao": "MAC",
    "Madagascar": "MDG",
    "Malawi": "MWI",
    "Malaysia": "MYS",
    "Maldives": "MDV",
    "Mali": "MLI",
    "Malta": "MLT",
    "Marshall Islands": "MHL",
    "Martinique": "MTQ",
    "Mauritania": "MRT",
    "Mauritius": "MUS",
    "Mayotte": "MYT",
    "Mexico": "MEX",
    "Micronesia": "FSM",
    "Moldova": "MDA",
    "Monaco": "MCO",
    "Mongolia": "MNG",
    "Montenegro": "MNE",
    "Montserrat": "MSR",
    "Morocco": "MAR",
    "Mozambique": "MOZ",
    "Myanmar": "MMR",
    "Namibia": "NAM",
    "Nauru": "NRU",
    "Nepal": "NPL",
    "Netherlands": "NLD",
    "New Caledonia": "NCL",
    "New Zealand": "NZL",
    "Nicaragua": "NIC",
    "Niger": "NER",
    "Nigeria": "NGA",
    "Niue": "NIU",
    "Norfolk Island": "NFK",
    "North Korea": "PRK",
    "North Macedonia": "MKD",
    "Northern Mariana Islands": "MNP",
    "Norway": "NOR",
    "Oman": "OMN",
    "Pakistan": "PAK",
    "Palau": "PLW",
    "Palestine": "PSE",
    "Panama": "PAN",
    "Papua New Guinea": "PNG",
    "Paraguay": "PRY",
    "Peru": "PER",
    "Philippines": "PHL",
    "Pitcairn Islands": "PCN",
    "Poland": "POL",
    "Portugal": "PRT",
    "Puerto Rico": "PRI",
    "Qatar": "QAT",
    "Romania": "ROU",
    "Russia": "RUS",
    "Rwanda": "RWA",
    "Samoa": "WSM",
    "San Marino": "SMR",
    "Saudi Arabia": "SAU",
    "Senegal": "SEN",
    "Serbia": "SRB",
    "Seychelles": "SYC",
    "Sierra Leone": "SLE",
    "Singapore": "SGP",
    "Sint Maarten": "SXM",
    "Slovakia": "SVK",
    "Slovenia": "SVN",
    "Solomon Islands": "SLB",
    "Somalia": "SOM",
    "South Africa": "ZAF",
    "South Georgia & South Sandwich Islands": "SGS",
    "South Korea": "NOR",
    "South Sudan": "SSD",
    "Spain": "ESP",
    "Sri Lanka": "LKA",
    "Sudan": "SDN",
    "Suriname": "SUR",
    "Svalbard & Jan Mayen": "SJM",
    "Sweden": "SWE",
    "Switzerland": "CHE",
    "Syria": "SYR",
    "Taiwan": "TWN",
    "Tajikistan": "TJK",
    "Tanzania": "TZA",
    "Thailand": "THA",
    "Togo": "TGO",
    "Tokelau": "TKL",
    "Tonga": "TON",
    "Trinidad & Tobago": "TTO",
    "Turkey": "TUR",
    "Turkmenistan": "TKM",
    "Turks & Caicos Islands": "TCA",
    "Tuvalu": "TUV",
    "U.S. Virgin Islands": "VIR",
    "Uganda": "UGA",
    "Ukraine": "UKR",
    "United Arab Emirates": "ARE",
    "United Kingdom": "GBR",
    "USA": "USA",
    "Uruguay": "URY",
    "Uzbekistan": "UZB",
    "Vanuatu": "VUT",
    "Vatican City": "VAT",
    "Venezuela": "VEN",
    "Vietnam": "VNM",
    "Wallis & Futuna": "WLF",
    "Western Sahara": "ESH",
    "Yemen": "YEM",
    "Zambia": "ZMB",
    "Zimbabwe": "ZWE"

}
const categories = {
    suicide: {
        name: "Suicide",
        subcategories: [{
                name: "Suicide rate (per 100,000 population)",
                code: "SDGSUICIDE"
            },
            {
                name: "Age-standardized suicide rates (per 100 000 population)",
                code: "MH_12"
            }
        ]
    },
    obesity: {
        name: "Obesity",
        subcategories: [{
                name: "Prevalence of obesity",
                code: "EQ_BMI30"
            },
            {
                displayName: "Prevalence of obesity among adults",
                name: "Prevalence of obesity among adults, BMI > 30 (age-standardized estimate) (%)",
                code: "NCD_BMI_30A"
            },
            {
                displayName: "Prevalence of obesity among children and adolescents",
                name: "Prevalence of obesity among children and adolescents, BMI > +2 standard deviations above the median (crude estimate) (%)",
                code: "NCD_BMI_PLUS2C"
            }
        ]
    },
    airPollution: {
        name: "Air pollution",
        subcategories: [{
            name: "Ambient air pollution attributable deaths",
            code: "AIR_1"
        }, {
            name: "Household air pollution attributable deaths",
            code: "AIR_11"
        }]
    }
}

let toasts = [
    {
        'text': 'Click on any country!',
        'position': '6 / 6 / 7 / 8'
    },
    {
        'text': 'You can reset view and selected country!',
        'position': '3 / 6 / 4 / 9'
    },
    {
        'text': 'Select categories and subcategories!',
        'position': '3 / 4 / 4 / 6'
    },
    {
        'text': 'Click the button!',
        'position': '4 / 4 / 5 / 6'
    },
    {
        'text': 'You can change the chart type!',
        'position': '5 / 10 / 6 / 12'
    },
    {
        'text': 'You can display the graph on fullscreen!',
        'position': '2 / 9 / 3 / 11'
    },
    {
        'text': 'You can also choose different modes!',
        'position':'3 / 10 / 3 / 12'
    },
    {
        'text': 'Add country to country list! (multi mode)',
        'position': '3 / 6 / 4 / 9'
    },
    {
        'text': 'Sample country list',
        'position': '7 / 4 / 8 / 6'
    },


]

const countryToIso = country => {
    return countriesObject[country]
}

function countriesToIso(countries) {
    let isoCodes = [];
    for (country of countries) {
        isoCodes.push(countriesObject[country]);
    }
    return isoCodes;
}