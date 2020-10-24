const countriesObject = { // country list
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
    "Democratic Republic of the Congo": "COD",
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
        nameEN: "Suicide",
        namePL: "Samobójstwa",
        subcategories: [{
            nameEN: "Suicide rates (per 100 000 population)",
            namePL: "Wskaźnik samobójstw (na 100 000 populacji)",
            code: "MH_12"
        }]
    },
    diseases: {
        nameEN: "Diseases",
        namePL: "Choroby Zakaźne",
        subcategories: [{
            code: "MALARIA002",
            nameEN: "Number of malaria cases",
            namePL: "Liczba przypadków malarii"
        }, {
            code: "HIV_0000000026",
            name: "Number of new HIV infections",
            namePL: "Liczba nowych zakażeń wirusem HIV"
        }]

    },
    airPollution: {
        nameEN: "Air pollution",
        namePL: "Zanieczyszczenie powietrza",
        subcategories: [{
            nameEN: "Ambient air pollution attributable deaths",
            namePL: "Zgony zpowodowane zanieczyszceniem powietrza",
            code: "AIR_1"
        }, {
            nameEN: "Ambient air pollution (Annual PM10)",
            namePL: "Zanieczyszczenie powietrza (Roczne PM10)",
            code: "AIR_2",
            unit: "&microg/m3"
        }]
    }
}

const toasts = [{
        'text': 'Click on any country to select it!',
        'position': '6 / 6 / 7 / 8'
    },
    {
        'text': 'By clicking reset button you reset everything you selected!',
        'position': '3 / 6 / 4 / 9'
    },
    {
        'text': 'After you chose a country, select a category and subcategory that you would like to view!',
        'position': '3 / 4 / 4 / 6'
    },
    {
        'text': 'Click the "view" button!',
        'position': '4 / 4 / 5 / 6'
    },
    {
        'text': 'You can alse change the chart type!',
        'position': '5 / 10 / 6 / 12'
    },
    {
        'text': 'In top right corner you can display the graph on fullscreen!',
        'position': '2 / 9 / 3 / 11'
    },
    {
        'text': 'We have diffrent modes too!',
        'position': '3 / 10 / 3 / 12'
    },
    {
        'text': 'Afrer changing to multi mode now you can compare multiple countries! Add country to country list!',
        'position': '3 / 6 / 4 / 9'
    },
    {
        'text': 'We prepared an example country list for you!',
        'position': '7 / 4 / 8 / 6'
    },
    {
        'text': 'In global mode you can display values on a map! We provided the option to hide the gui! So you can use it like a normal map!',
        'position': '3 / 8 / 4 / 10'
    },
    {
        'text': 'You can change the colors of the legend!',
        'position': '8 / 4 / 9 / 6'
    },
    {
        'text': 'You can change the years using the slider below!',
        'position': '9 / 9 / 10 / 11'
    },
    {
        'text': 'By clicking the play button you can play little animation how values changed over the years!',
        'position': '9 / 6 / 10 / 8'
    },
]

const languageText = {
    EN: {
        globalMode: "All countries",
        countryOnList: "This country is already on the list",
        countryIsNull: "Cannot add nothing to country list",
        noDataPolygon: "No data",
        invalidCountry: "Please select a valid country",
        wrongCountry: "Clicked country was not recognized",
        noData: "No data avaiable for this country",
        fetchError: "Error while fetching data",
        minCountry: "Please select 2 or more countries",
        nullCountry: "None",
        dataZero: "Data is equal to zero and is not able to be displayed on graph",
        dataZeroMulti: [
            "Data for countries: ", " is equal to zero and won't be displayed"
        ],
        difference: {
            increased: function(value1, value2, country, subcategory, percent) {
                return `<p>For ${country}, between years <b>${value1}</b> and <b>${value2}</b> ${subcategory} increased by <b>${percent}</b>%</p>`;
            },
            decreased: function(value1, value2, country, subcategory, percent) {
                return `<p>For ${country}, between years <b>${value1}</b> and <b>${value2}</b> ${subcategory} decreased by <b>${percent}</b>%</p>`;
            },
        }
    },
    PL: {
        globalMode: "Wszystkie kraje",
        countryOnList: "Ten kraj już się znajduje na liście",
        countryIsNull: "Nie można dodać niczego do listy",
        noDataPolygon: "Brak danych",
        invalidCountry: "Prosze wybrać prawidłowy kraj",
        wrongCountry: "Wybrany kraj nie został rozpoznany",
        noData: "Brak danych dla tego kraju",
        fetchError: "Błąd przy pobieraniu danych",
        minCountry: "Prosze wybrać minimum 2 kraje",
        nullCountry: "Brak",
        dataZero: "Dane są równe zeru i nie są w stanie być wyświetlone",
        dataZeroMulti: [
            "Dane dla krajów: ", " są równe zeru i nie zostaną wyświetlone"
        ],
        difference: {
            increased: function(value1, value2, country, subcategory, percent) {
                return `<p>Dla ${country}, w latach <b>${value1}</b> a <b>${value2}</b> ${subcategory} wzrosło o <b>${percent}</b>%</p>`;
            },
            decreased: function(value1, value2, country, subcategory, percent) {
                return `<p>Dla ${country}, w latach <b>${value1}</b> a <b>${value2}</b> ${subcategory} spadło o <b>${percent}</b>%</p>`;
            },
        }

    }
}

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