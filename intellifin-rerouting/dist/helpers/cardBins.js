"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinDetails = exports.CardBins = void 0;
exports.CardBins = [
    {
        "id": 506105,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 432198,
        "bank": "AXIS BANK, LTD.",
        "code": "AXIS"
    },
    {
        "id": 426150,
        "bank": "NOVO BANCO",
        "code": "NOVO"
    },
    {
        "id": 551609,
        "bank": "UNITY BANK PLC",
        "code": "UNITY"
    },
    {
        "id": 470651,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 456835,
        "bank": "DUBAI ISLAMIC BANK",
        "code": "DIB"
    },
    {
        "id": 420319,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 465910,
        "bank": "LLOYDS BANK PLC"
    },
    {
        "id": 506107,
        "bank": "STERLING BANK",
        "code": "STERLING"
    },
    {
        "id": 556677,
        "bank": "BARCLAYS BANK PLC.",
        "code": "BARCLAYS"
    },
    {
        "id": 506187,
        "bank": "STERLING BANK",
        "code": "STERLING"
    },
    {
        "id": 468219,
        "bank": "FIDELITY BANK PLC",
        "code": "FIDELITY"
    },
    {
        "id": 546196,
        "bank": "REPUBLIC BANK & TRUST COMPANY",
        "code": "REPUBLIC"
    },
    {
        "id": 521982,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 457803,
        "bank": "WEMA BANK",
        "code": "WEMA"
    },
    {
        "id": 539184,
        "bank": "CAIXA CENTRAL DE CREDITO AGRICOLA MUTUO",
        "code": "CAIXA"
    },
    {
        "id": 475177,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS",
    },
    {
        "id": 402167,
        "bank": "INVESTEC BANK, LTD.",
        "code": "INVESTEC"
    },
    {
        "id": 527335,
        "bank": "BANK OF MONTREAL",
        "code": "BMO"
    },
    {
        "id": 559432,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 523982,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 528650,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 522901,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 519863,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 485738,
        "bank": "Citi bank",
        "code": "CITI BANK",
    },
    {
        "id": 524910,
        "bank": "PROVIDUS BANK PLC",
        "code": "PROVIDUS"
    },
    {
        "id": 506119,
        "bank": "WEMA BANK",
        "code": "WEMA"
    },
    {
        "id": 421042,
        "bank": "STANBIC IBTC BANK PLC",
        "code": "STANBIC",
    },
    {
        "id": 519885,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 453188,
        "bank": "BARCLAYS BANK OF ZAMBIA, LTD.",
        "code": "BARCLAYS"
    },
    {
        "id": 519905,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD."
    },
    {
        "id": 457806,
        "bank": "WEMA BANK"
    },
    {
        "id": 512713,
        "bank": "DUKHAN BANK Q.P.S.C."
    },
    {
        "id": 527515,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BOA"
    },
    {
        "id": 513469,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 400974,
        "bank": "FIRSTRAND BANK, LTD.",
        "code": "FIRSTRAND"
    },
    {
        "id": 416598,
        "bank": "REVOLUT, LTD.",
        "code": "REVOLUT"
    },
    {
        "id": 457770,
        "bank": "STANBIC IBTC BANK PLC",
        "code": "STANBIC"
    },
    {
        "id": 403745,
        "bank": "STANDARD CHARTERED BANK KENYA, LTD.",
        "code": "STANBIC _KENYA"
    },
    {
        "id": 469666,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 559441,
        "bank": "WEMA BANK PLC.",
        "code": "WEMA"
    },
    {
        "id": 524271,
        "bank": "FIDELITY BANK PLC",
        "code": "FIDELITY"
    },
    {
        "id": 650004,
        "bank": "FIDELITY BANK",
        "code": "FIDELITY"
    },
    {
        "id": 428455,
        "bank": "BANK OF NEW ZEALAND",
        "code": "BNZ"
    },
    {
        "id": 506139,
        "bank": "INFINITY TRUST SAVINGS & LOANS, LTD.",
        "code": "INFINITY"
    },
    {
        "id": 506118,
        "bank": "ECOBANK",
        "code": "ECOBANK"
    },
    {
        "id": 536496,
        "bank": "KBC BANKVERZEKERINGSHOLDING (KBC BANK N.V.)",
        "code": "KBC"
    },
    {
        "id": 412583,
        "bank": "FIRST BANK NIGERIA, LTD.",
        "code": "FBN"
    },
    {
        "id": 533248,
        "bank": "COMERICA BANK",
        "code": "COMERICA"
    },
    {
        "id": 476291,
        "bank": "NETWORK INTERNATIONAL LLC",
        "code": "NETWORK"
    },
    {
        "id": 414326,
        "bank": "BAC INTERNATIONAL BANK (PANAMA), INC.",
        "code": "BAC"
    },
    {
        "id": 461984,
        "bank": "THE HONGKONG AND SHANGHAI BANKING CORPORATION, LTD.",
        "code": "HSBC"
    },
    {
        "id": 545993,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 506100,
        "bank": "UNITY BANK",
        "code": "UNITY"
    },
    {
        "id": 506180,
        "bank": "SUNTRUST BANK",
        "code": "SUNTRUST"
    },
    {
        "id": 506123,
        "bank": "UNION",
        "code": "UNION"
    },
    {
        "id": 539983,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 542432,
        "bank": "FIFTH THIRD BANK",
        "code": "FIFTH"
    },
    {
        "id": 443913,
        "bank": "EMIRATES NBD",
        "code": "EMIRATES"
    },
    {
        "id": 506125,
        "bank": "STERLING BANK",
        "code": "STERLING"
    },
    {
        "id": 446274,
        "bank": "LLOYDS BANK PLC",
        "code": "LLOYDS"
    },
    {
        "id": 506184,
        "bank": "ACCESS BANK",
        "code": "ACCESS"
    },
    {
        "id": 460054,
        "bank": "FIDELITY BANK PLC",
        "code": "FIDELITY"
    },
    {
        "id": 460802,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 506137,
        "bank": "JAIZ BANK",
        "code": "JAIZ"
    },
    {
        "id": 529580,
        "bank": "EVOLVE BANK & TRUST",
        "code": "EVOLVE"
    },
    {
        "id": 448233,
        "bank": "TD BANK, N.A.",
        "code": "TDBANK"
    },
    {
        "id": 517731,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 553813,
        "bank": "JAIZ BANK PLC",
        "code": "JAIZ"
    },
    {
        "id": 539185,
        "bank": "TITAN TRUST BANK, LTD.",
        "code": "TITAN"
    },
    {
        "id": 512687,
        "bank": "SAINSBURY'S BANK PLC",
        "code": "SAINSBURY"
    },
    {
        "id": 519908,
        "bank": "POLARIS BANK, LTD.",
        "code": "POLARIS"
    },
    {
        "id": 416549,
        "bank": "REVOLUT, LTD.",
        "code": "REVOLUT"
    },
    {
        "id": 402013,
        "bank": ""
    },
    {
        "id": 465944,
        "bank": "HSBC BANK PLC",
        "code": "HSBC"
    },
    {
        "id": 416639,
        "bank": "MASRAF AL RAYAN",
        "code": "MASRAF"
    },
    {
        "id": 557685,
        "bank": "DUKHAN BANK Q.P.S.C.",
        "code": "DUKHAN"
    },
    {
        "id": 534413,
        "bank": "UNICREDIT SPA",
        "code": "UNICREDIT"
    },
    {
        "id": 492586,
        "bank": "UNION BANK OF NIGERIA",
        "code": "UNION"
    },
    {
        "id": 492181,
        "bank": "LLOYDS BANK PLC",
        "code": "LLOYDS"
    },
    {
        "id": 444506,
        "bank": "STANBIC IBTC BANK PLC",
        "code": "STANBIC"
    },
    {
        "id": 421091,
        "bank": "ANDREWS F.C.U.",
        "code": "ANDREWS"
    },
    {
        "id": 438857,
        "bank": "CHASE BANK USA, N.A.",
        "code": "CHASE"
    },
    {
        "id": 559443,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 519830,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 470652,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 430104,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 401945,
        "bank": "ECOBANK, LTD.",
        "code": "ECOBANK"
    },
    {
        "id": 531525,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 451461,
        "bank": "CHINA MERCHANTS BANK",
        "code": "CHINA"
    },
    {
        "id": 557686,
        "bank": "DUKHAN BANK Q.P.S.C.",
        "code": "DUKHAN"
    },
    {
        "id": 414720,
        "bank": "CHASE BANK USA, N.A.",
        "code": "CHASE"
    },
    {
        "id": 506121,
        "bank": "ASO SAVINGS & LOANS",
        "code": "ASO"
    },
    {
        "id": 534869,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BANKOFAMERICA"
    },
    {
        "id": 457804,
        "bank": "WEMA BANK",
        "code": "WEMA"
    },
    {
        "id": 493000,
        "bank": "DKB"
    },
    {
        "id": 532732,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 530083,
        "bank": "REPUBLIC BANK & TRUST COMPANY",
        "code": "REPUBLIC"
    },
    {
        "id": 507871,
        "bank": "LASRRA CARDS- MULTIPLE BANKS",
        "code": "LASRRA"
    },
    {
        "id": 459664,
        "bank": "REVOLUT, LTD."
    },
    {
        "id": 440066,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BANKOFAMERICA"
    },
    {
        "id": 552764,
        "bank": "SEB KORT BANK AB",
        "code": "SEB"
    },
    {
        "id": 522250,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 453199,
        "bank": "BANQUE SAHELO-SAHARIENNE POUR LINVESTISSEMENT ET LE COMMERCE",
        "code": "BANQUE"
    },
    {
        "id": 558962,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BANKOFAMERICA"
    },
    {
        "id": 526219,
        "bank": "CITIBANK N.A.",
        "code": "CITIBANK"
    },
    {
        "id": 485460,
        "bank": "FIRSTRAND BANK, LTD.",
        "code": "FIRSTRAND"
    },
    {
        "id": 506177,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBA"
    },
    {
        "id": 532155,
        "bank": "UNITY BANK PLC",
        "code": "UNITY"
    },
    {
        "id": 402924,
        "bank": "POLARIS BANK, LTD.",
        "code": "POLARIS"
    },
    {
        "id": 536024,
        "bank": "UNION BANK OF NIGERIA PLC",
        "code": "UNION"
    },
    {
        "id": 552067,
        "bank": "HSBC BANK MIDDLE EAST",
        "code": "HSBC"
    },
    {
        "id": 418760,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 422594,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 559466,
        "bank": "WEMA BANK PLC.",
        "code": "WEMA"
    },
    {
        "id": 471415,
        "bank": "STANDARD CHARTERED BANK NIGERIA",
        "code": "STANDARD"
    },
    {
        "id": 506120,
        "bank": "STANBIC IBTC",
        "code": "STANBIC"
    },
    {
        "id": 529720,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 559453,
        "bank": "WEMA BANK PLC",
        "code": "WEMA"
    },
    {
        "id": 506102,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 553415,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 470655,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBA"
    },
    {
        "id": 445493,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 471473,
        "bank": "FIDELITY BANK, LTD.",
        "code": "FIDELITY"
    },
    {
        "id": 518973,
        "bank": "SUNTRUST BANK NIGERIA, LTD.",
        "code": "SUNTRUST"
    },
    {
        "id": 490744,
        "bank": "DEUTSCHE POSTBANK AG",
        "code": "DEUTSCHE"
    },
    {
        "id": 506117,
        "bank": "UNITY BANK",
        "code": "UNITY"
    },
    {
        "id": 516383,
        "bank": "BANCO SANTANDER, S.A.",
        "code": "SANTANDER"
    },
    {
        "id": 414709,
        "bank": "CAPITAL ONE BANK (USA), N.A.",
        "code": "COB"
    },
    {
        "id": 536902,
        "bank": "WEMA BANK PLC.",
        "code": "WEMA"
    },
    {
        "id": 506104,
        "bank": "ACCESS BANK",
        "code": "ACCESS"
    },
    {
        "id": 420320,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 534418,
        "bank": "CAIRO AMMAN BANK PLC",
        "code": "CAIRO"
    },
    {
        "id": 475130,
        "bank": "NATIONAL WESTMINSTER BANK PLC",
        "code": "NATIONAL"
    },
    {
        "id": 465942,
        "bank": "HSBC BANK PLC",
        "code": "HSBC"
    },
    {
        "id": 506144,
        "bank": "EKONDO MICROFINANCE BANK, LTD.",
        "code": "EKONDO"
    },
    {
        "id": 470484,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 475127,
        "bank": "NATIONAL WESTMINSTER BANK PLC",
        "code": "NATIONAL"
    },
    {
        "id": 485451,
        "bank": "CITIBANK NIGERIA, LTD.",
        "code": "CITIBANK"
    },
    {
        "id": 484680,
        "bank": "ECOBANK GHANA, LTD.",
        "code": "ECOBANK"
    },
    {
        "id": 525495,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 522453,
        "bank": "UNITY BANK PLC",
        "code": "UNITY"
    },
    {
        "id": 458274,
        "bank": "POLARIS BANK, LTD.",
        "code": "POLARIS"
    },
    {
        "id": 445147,
        "bank": "ABSA GROUP, LTD.",
        "code": "ABSA"
    },
    {
        "id": 506136,
        "bank": "PROVIDUS BANK",
        "code": "PROVIDUS"
    },
    {
        "id": 411736,
        "bank": "ECOBANK NIGERIA PLC",
        "code": "ECOBANK"
    },
    {
        "id": 490070,
        "bank": "JPMORGAN CHASE BANK, N.A."
    },
    {
        "id": 418745,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 483953,
        "bank": "CAJA RURAL DE ALMERIA Y MALAGA",
        "code": "CAJA"
    },
    {
        "id": 506148,
        "bank": "OHAFIA MICROFINANCE BANK, LTD.",
        "code": "OHAFIA"
    },
    {
        "id": 474481,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BANK"
    },
    {
        "id": 408379,
        "bank": "ECOBANK, LTD.",
        "code": "ECOBANK"
    },
    {
        "id": 539941,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 558760,
        "bank": "PROVIDUS BANK PLC",
        "code": "PROVIDUS"
    },
    {
        "id": 473703,
        "bank": "WELLS FARGO BANK, N.A.",
        "code": "WELLS"
    },
    {
        "id": 484842,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 542390,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 516256,
        "bank": "PROVIDUS BANK PLC",
        "code": "PROVIDUS"
    },
    {
        "id": 506143,
        "bank": "ACCION MICROFINANCE BANK, LTD.",
        "code": "ACCION"
    },
    {
        "id": 537434,
        "bank": "WISE PAYMENTS, LTD.",
        "code": "WISE"
    },
    {
        "id": 511572,
        "bank": "EMIGRANT BANK",
        "code": "EMIGRANT"
    },
    {
        "id": 518791,
        "bank": "LLOYDS BANK PLC",
        "code": "LLOYDS"
    },
    {
        "id": 524282,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 400022,
        "bank": "NAVY F.C.U.",
        "code": "NAVY"
    },
    {
        "id": 459954,
        "bank": "USAA",
        "code": "USAA"
    },
    {
        "id": 469667,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 536613,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 506140,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 446291,
        "bank": "HALIFAX PLC",
        "code": "HALIFAX"
    },
    {
        "id": 521729,
        "bank": "COMMONWEALTH BANK OF AUSTRALIA",
        "code": "COMMONWEALTH"
    },
    {
        "id": 524289,
        "bank": "UNION BANK OF NIGERIA PLC",
        "code": "UNION"
    },
    {
        "id": 555940,
        "bank": "KEYSTONE BANK, LTD.",
        "code": "KEYSTONE"
    },
    {
        "id": 420767,
        "bank": "JPMORGAN CHASE BANK, N.A.",
        "code": "JPMORGAN"
    },
    {
        "id": 465992,
        "bank": ""
    },
    {
        "id": 533605,
        "bank": "NATIONAL BANK OF RAS AL-KHAIMAH (RAKBANK)",
        "code": "RAKBANK"
    },
    {
        "id": 461266,
        "bank": "DIAMOND C.U.",
        "code": "DIAMOND"
    },
    {
        "id": 492182,
        "bank": "LLOYDS BANK PLC",
        "code": "LLOYDS"
    },
    {
        "id": 418742,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 456933,
        "bank": "TRANSFERWISE",
        "code": "TRANSFERWISE"
    },
    {
        "id": 438227,
        "bank": "DUKHAN BANK",
        "code": "DUKHAN"
    },
    {
        "id": 539586,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 412061,
        "bank": "MERRICK BANK CORPORATION",
        "code": "MERRICK"
    },
    {
        "id": 458587,
        "bank": "STANDARD CHARTERED BANK NIGERIA",
        "code": "STANDARD"
    },
    {
        "id": 506106,
        "bank": "POLARIS BANK",
        "code": "POLARIS"
    },
    {
        "id": 516874,
        "bank": "JSC CB PRIVATBANK",
        "code": "PRIVATBANK"
    },
    {
        "id": 419391,
        "bank": "I & M BANK (T), LTD.",
        "code": "I&M"
    },
    {
        "id": 446542,
        "bank": "WELLS FARGO BANK, N.A.",
        "code": "WELLS"
    },
    {
        "id": 519878,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 489002,
        "bank": "COMMERCIAL BANK OF AFRICA, LTD.",
        "code": "CBA"
    },
    {
        "id": 479081,
        "bank": "FIRSTRAND BANK, LTD.",
        "code": "FIRSTRAND"
    },
    {
        "id": 512934,
        "bank": "HERITAGE BANKING COMPANY, LTD.",
        "code": "HERITAGE"
    },
    {
        "id": 539923,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 506116,
        "bank": "HERITAGE BANK",
        "code": "HERITAGE"
    },
    {
        "id": 537010,
        "bank": "ECOBANK NIGERIA PLC",
        "code": "ECOBANK"
    },
    {
        "id": 492069,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 443910,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 650003,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 455598,
        "bank": "HSBC BANK PLC",
        "code": "HSBC"
    },
    {
        "id": 472409,
        "bank": "TD CANADA TRUST",
        "code": "TD"
    },
    {
        "id": 450075,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 496026,
        "bank": "DIAMOND BANK, LTD.",
        "code": "DIAMOND"
    },
    {
        "id": 496023,
        "bank": "DIAMOND BANK, LTD.",
        "code": "DIAMOND"
    },
    {
        "id": 517868,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 519899,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD."
    },
    {
        "id": 475175,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 419227,
        "bank": "POLARIS BANK, LTD.",
        "code": "POLARIS"
    },
    {
        "id": 519911,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 539945,
        "bank": ""
    },
    {
        "id": 506163,
        "bank": "ACCESS BANK",
        "code": "ACCESS"
    },
    {
        "id": 466039,
        "bank": "CAL BANK, LTD.",
        "code": "CAL"
    },
    {
        "id": 550130,
        "bank": "KASIKORNBANK PUBLIC COMPANY, LTD.",
        "code": "KASIKORN"
    },
    {
        "id": 552225,
        "bank": "U.S. BANK NATIONAL ASSOCIATION",
        "code": "USBN"
    },
    {
        "id": 650006,
        "bank": "ACCESS BANK",
        "code": "ACCESS"
    },
    {
        "id": 418021,
        "bank": "UNITED NATIONS F.C.U.",
        "code": "UNF"
    },
    {
        "id": 557127,
        "bank": "CITIBANK N.A.",
        "code": "CITIBANK"
    },
    {
        "id": 431581,
        "bank": "ICICI BANK, LTD.",
        "code": "ICICI"
    },
    {
        "id": 533301,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 524687,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 521101,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 528668,
        "bank": "HERITAGE BANKING COMPANY, LTD.",
        "code": "HERITAGE"
    },
    {
        "id": 529820,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 537389,
        "bank": "WIREX, LTD."
    },
    {
        "id": 422584,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 471459,
        "bank": "STANDARD CHARTERED BANK NIGERIA",
        "code": "SCB"
    },
    {
        "id": 406234,
        "bank": "UNITED BANK FOR AFRICA",
        "code": "UBA"
    },
    {
        "id": 451401,
        "bank": "ROYAL BANK OF CANADA",
        "code": "RBC"
    },
    {
        "id": 498005,
        "bank": "SUMITOMO MITSUI CARD CO., LTD.",
        "code": "SMCC"
    },
    {
        "id": 528649,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 432226,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 445598,
        "bank": "STANDARD CHARTERED BANK GHANA, LTD.",
        "code": "SCB"
    },
    {
        "id": 471232,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 471464,
        "bank": "STANDARD CHARTERED BANK NIGERIA",
        "code": "SCB"
    },
    {
        "id": 506122,
        "bank": "ECOBANK",
        "code": "ECOBANK"
    },
    {
        "id": 420375,
        "bank": "BARWA BANK",
        "code": "BARWA"
    },
    {
        "id": 465858,
        "bank": "BARCLAYS BANK PLC.",
        "code": "BARCLAYS"
    },
    {
        "id": 506150,
        "bank": "HERITAGE BANK",
        "code": "HERITAGE"
    },
    {
        "id": 535522,
        "bank": "MONZO BANK, LTD.",
        "code": "MONZO"
    },
    {
        "id": 526099,
        "bank": "HDFC BANK, LTD.",
        "code": "HDFC"
    },
    {
        "id": 431980,
        "bank": "SANTANDER UK PLC",
        "code": "SANTANDER"
    },
    {
        "id": 552832,
        "bank": "BMO HARRIS BANK N.A.",
        "code": "BMO"
    },
    {
        "id": 555493,
        "bank": "I & M BANK, LTD.",
        "code": "IMB"
    },
    {
        "id": 413102,
        "bank": "ZENITH BANK (GHANA), LTD.",
        "code": "ZENITH"
    },
    {
        "id": 406185,
        "bank": ""
    },
    {
        "id": 522078,
        "bank": "INTERNATIONAL CARD SERVICES B.V.",
        "code": "ICS"
    },
    {
        "id": 427011,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 507870,
        "bank": "LOTUS BANK LIMITED",
        "code": "LOTUS"
    },
    {
        "id": 506126,
        "bank": "ACCESS BANK",
        "code": "ACCESS"
    },
    {
        "id": 460053,
        "bank": "FIDELITY BANK PLC",
        "code": "FIDELITY"
    },
    {
        "id": 497355,
        "bank": "SOCIETE GENERALE, S.A.",
        "code": "SOCIETE GENERALE"
    },
    {
        "id": 559113,
        "bank": "PROVIDUS BANK PLC"
    },
    {
        "id": 514585,
        "bank": "FIDELITY BANK PLC",
        "code": "FIDELITY"
    },
    {
        "id": 515721,
        "bank": "TAISHIN INTERNATIONAL BANK",
        "code": "TAISHIN"
    },
    {
        "id": 519379,
        "bank": "HSBC BANK EGYPT",
        "code": "HSBC"
    },
    {
        "id": 521973,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 481582,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BFA"
    },
    {
        "id": 424451,
        "bank": "BANK RESPUBLIKA OJSC",
        "code": "BANK RESPUBLIKA"
    },
    {
        "id": 557435,
        "bank": "STARLING BANK, LTD.",
        "code": "STARLING"
    },
    {
        "id": 524630,
        "bank": "COASTAL COMMUNITY BANK",
        "code": "COASTAL"
    },
    {
        "id": 443047,
        "bank": "PNC FINANCIAL SERVICES GROUP, INC.",
        "code": "PNC"
    },
    {
        "id": 540385,
        "bank": "CITIBANK N.A.",
        "code": "CITIBANK"
    },
    {
        "id": 465950,
        "bank": "HSBC BANK PLC",
        "code": "HSBC"
    },
    {
        "id": 496022,
        "bank": "DIAMOND BANK, LTD.",
        "code": "DIAMOND"
    },
    {
        "id": 428104,
        "bank": "FIRSTRAND BANK, LTD.",
        "code": "FIRSTRAND"
    },
    {
        "id": 518896,
        "bank": "KUVEYT TURK KATILIM BANKASI , A.S.",
        "code": "KUVEYT TURK"
    },
    {
        "id": 523641,
        "bank": "BANCO COMERCIAL PORTUGUES, S.A.",
        "code": "BCP"
    },
    {
        "id": 536295,
        "bank": "ABU DHABI COMMERCIAL BANK"
    },
    {
        "id": 420333,
        "bank": "UNION BANK OF NIGERIA PLC",
        "code": "UNION"
    },
    {
        "id": 479213,
        "bank": "TD BANK, N.A.",
        "code": "TD"
    },
    {
        "id": 496021,
        "bank": "DIAMOND BANK, LTD.",
        "code": "DIAMOND"
    },
    {
        "id": 467875,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 456786,
        "bank": "MASRAF AL RAYAN",
        "code": "MASRAF AL RAYAN"
    },
    {
        "id": 450710,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 531992,
        "bank": "ECOBANK NIGERIA PLC",
        "code": "ECOBANK"
    },
    {
        "id": 474489,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BOA"
    },
    {
        "id": 506110,
        "bank": "KEYSTONE BANK"
    },
    {
        "id": 506124,
        "bank": "VERVE BIN - MICROFINANCE BANKS IN NIGERIA",
        "code": "VERVE"
    },
    {
        "id": 506108,
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "code": "FCMB"
    },
    {
        "id": 529751,
        "bank": "ECOBANK NIGERIA PLC",
        "code": "ECOBANK"
    },
    {
        "id": 426684,
        "bank": "CHASE BANK USA, N.A.",
        "code": "CHASE"
    },
    {
        "id": 523046,
        "bank": "PROVIDUS BANK PLC",
        "code": "PROVIDUS"
    },
    {
        "id": 518176,
        "bank": "BANCO BILBAO VIZCAYA ARGENTARIA, S.A.",
        "code": "BBVA"
    },
    {
        "id": 506162,
        "bank": "STERLING BANK",
        "code": "STERLING"
    },
    {
        "id": 506195,
        "bank": "LAPO MICROFINANCE BANK, LTD.",
        "code": "LAPO"
    },
    {
        "id": 489428,
        "bank": "BANK OF CYPRUS PUBLIC CO., LTD.",
        "code": "BANK OF CYPRUS"
    },
    {
        "id": 400890,
        "bank": "STERLING BANK",
        "code": "STERLING"
    },
    {
        "id": 521090,
        "bank": "UNITED BANK FOR AFRICA PLC",
        "code": "UBA"
    },
    {
        "id": 552191,
        "bank": "EMIRATES NBD",
        "code": "EMIRATES"
    },
    {
        "id": 464436,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 465901,
        "bank": "BARCLAYS BANK PLC.",
        "code": "BARCLAYS"
    },
    {
        "id": 457896,
        "bank": "FIRSTRAND BANK, LTD.",
        "code": "FIRSTRAND"
    },
    {
        "id": 535686,
        "bank": "PSA PAYMENT SERVICES AUSTRIA GMBH",
        "code": "PSA"
    },
    {
        "id": 450073,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 440563,
        "bank": "JOINT-STOCK HALYK SAVINGS BANK OF KAZAKHSTAN",
        "code": "HALYK"
    },
    {
        "id": 414796,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BOA"
    },
    {
        "id": 533853,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 549099,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BOA"
    },
    {
        "id": 428225,
        "bank": "POLARIS BANK, LTD.",
        "code": "POLARIS"
    },
    {
        "id": 556950,
        "bank": "NATIONAL WESTMINSTER BANK PLC",
        "code": "NATWEST"
    },
    {
        "id": 533082,
        "bank": "HSBC BANK USA, NATIONAL ASSOCIATION",
        "code": "HSBC"
    },
    {
        "id": 558158,
        "bank": "BANCORP BANK",
        "code": "BANCORP"
    },
    {
        "id": 410367,
        "bank": "BAWAG P.S.K. BANK",
        "code": "BAWAG"
    },
    {
        "id": 456355,
        "bank": "INTERNATIONAL CARD SERVICES B.V.",
        "code": "ICS"
    },
    {
        "id": 506166,
        "bank": "UNION BANK",
        "code": "UNION"
    },
    {
        "id": 428692,
        "bank": "UNITED BANK FOR AFRICA (UBA) PLC",
        "code": "UBA"
    },
    {
        "id": 450074,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 506115,
        "bank": "FIDELITY BANK",
        "code": "FIDELITY"
    },
    {
        "id": 459661,
        "bank": "YORKSHIRE BANK",
        "code": "YORKSHIRE"
    },
    {
        "id": 410540,
        "bank": "ACCESS BANK / KUDA",
        "code": "KUDA"
    },
    {
        "id": 518869,
        "bank": "BDO UNIBANK, INC."
    },
    {
        "id": 506109,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 522340,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 506145,
        "bank": "FIRST BANK OF NIGERIA PLC",
        "code": "FBN"
    },
    {
        "id": 402451,
        "bank": "BANK OF AMERICA, NATIONAL ASSOCIATION",
        "code": "BOA"
    },
    {
        "id": 537410,
        "bank": "NATIONAL WESTMINSTER BANK PLC",
        "code": "NATWEST"
    },
    {
        "id": 428685,
        "bank": "HSBC BANK MIDDLE EAST",
        "code": "HSBC"
    },
    {
        "id": 510594,
        "bank": "TEXAS TRUST CREDIT UNION",
        "code": "TEXAS"
    },
    {
        "id": 464847,
        "bank": "GLOBUS BANK",
        "code": "GLOBUS"
    },
    {
        "id": 497040,
        "bank": "LA BANQUE POSTALE",
        "code": "POSTALE"
    },
    {
        "id": 439957,
        "bank": "STANBIC BANK GHANA, LTD.",
        "code": "STANBIC"
    },
    {
        "id": 517805,
        "bank": "CAPITAL ONE BANK (USA), NATIONAL ASSOCIATION",
        "code": "CAPITAL"
    },
    {
        "id": 471463,
        "bank": "STANDARD CHARTERED BANK NIGERIA",
        "code": "STANBIC"
    },
    {
        "id": 453928,
        "bank": "HSBC BANK MIDDLE EAST",
        "code": "HSBC"
    },
    {
        "id": 496009,
        "bank": "DIAMOND BANK, LTD.",
        "code": "DIAMOND"
    },
    {
        "id": 458409,
        "bank": "BARCLAYS BANK OF KENYA, LTD.",
        "code": "BARCLAYS"
    },
    {
        "id": 416919,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 559424,
        "bank": "STANDARD BANK OF SOUTH AFRICA, LTD.",
        "code": "STANDARD"
    },
    {
        "id": 540761,
        "bank": "GUARANTY TRUST BANK PLC",
        "code": "GTB"
    },
    {
        "id": 506146,
        "bank": "PROVIDUS BANK",
        "code": "PROVIDUS"
    },
    {
        "id": 458089,
        "bank": "BANK LEUMI LE-ISRAEL BM",
        "code": "LEUMI"
    },
    {
        "id": 424631,
        "bank": "CHASE BANK USA, N.A.",
        "code": "CHASE"
    },
    {
        "id": 522066,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 457766,
        "bank": "STANBIC IBTC BANK PLC",
        "code": "STANBIC"
    },
    {
        "id": 465865,
        "bank": "BARCLAYS BANK PLC.",
        "code": "BARCLAYS"
    },
    {
        "id": 552188,
        "bank": "TESCO PERSONAL FINANCE, LTD.",
        "code": "TESCO"
    },
    {
        "id": 468588,
        "bank": "ZENITH BANK",
        "code": "ZENITH"
    },
    {
        "id": 458792,
        "bank": "FIDELITY BANK PLC",
        "code": "FIDELITY"
    },
    {
        "id": 506127,
        "bank": "HASAL MICROFINANCE BANK, LTD.",
        "code": "HASAL"
    },
    {
        "id": 522522,
        "bank": "ACCESS BANK PLC",
        "code": "ACCESS"
    },
    {
        "id": 411737,
        "bank": "ECOBANK NIGERIA PLC",
        "code": "ECOBANK"
    },
    {
        "id": 533477,
        "bank": "STERLING BANK PLC",
        "code": "STERLING"
    },
    {
        "id": 507872,
        "bank": "OPAY DIGITAL SERVICES LIMITED",
        "code": "OPAY"
    },
    {
        "id": 465427,
        "bank": "Carbon",
        "code": "Carbon"
    },
    {
        'id': 530072,
        "bank": "PAYONEER EUROPE LIMITED",
        "code": "Payoneer"
    }
];
const getBinDetails = (bin) => exports.CardBins.find((card) => card.id === parseInt(bin)) || {
    id: 0,
    bank: "Unknown",
    code: "Unknown"
};
exports.getBinDetails = getBinDetails;
exports.default = exports.CardBins;
//# sourceMappingURL=cardBins.js.map