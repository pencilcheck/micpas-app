import { pgTable, varchar } from "drizzle-orm/pg-core";

export const vwPersons = pgTable("vwPersons", {
	ID: varchar("ID"),
	NameWCompany: varchar("NameWCompany"),
	Prefix: varchar("Prefix"),
	FirstName: varchar("FirstName"),
	MiddleName: varchar("MiddleName"),
	LastName: varchar("LastName"),
	Suffix: varchar("Suffix"),
	FirstLast: varchar("FirstLast"),
	CompanyID: varchar("CompanyID"),
	CompanyName: varchar("CompanyName"),
	Company: varchar("Company"),
	Department: varchar("Department"),
	Title: varchar("Title"),
	PreferredAddress: varchar("PreferredAddress"),
	PreferredBillingAddress: varchar("PreferredBillingAddress"),
	PreferredShippingAddress: varchar("PreferredShippingAddress"),
	AddressID: varchar("AddressID"),
	AddressLine1: varchar("AddressLine1"),
	AddressLine2: varchar("AddressLine2"),
	AddressLine3: varchar("AddressLine3"),
	AddressLine4: varchar("AddressLine4"),
	City: varchar("City"),
	County: varchar("County"),
	State: varchar("State"),
	ZipCode: varchar("ZipCode"),
	ZipCode5Numeric: varchar("ZipCode5Numeric"),
	Country: varchar("Country"),
	CountryCodeID: varchar("CountryCodeID"),
	PreferredPhone: varchar("PreferredPhone"),
	PhoneID: varchar("PhoneID"),
	PhoneCountryCode: varchar("PhoneCountryCode"),
	PhoneAreaCode: varchar("PhoneAreaCode"),
	Phone: varchar("Phone"),
	PhoneExtension: varchar("PhoneExtension"),
	FaxID: varchar("FaxID"),
	FaxCountryCode: varchar("FaxCountryCode"),
	FaxAreaCode: varchar("FaxAreaCode"),
	FaxPhone: varchar("FaxPhone"),
	CellPhoneID: varchar("CellPhoneID"),
	CellCountryCode: varchar("CellCountryCode"),
	CellAreaCode: varchar("CellAreaCode"),
	CellPhone: varchar("CellPhone"),
	PagerPhoneID: varchar("PagerPhoneID"),
	PagerCountryCode: varchar("PagerCountryCode"),
	PagerAreaCode: varchar("PagerAreaCode"),
	PagerPhone: varchar("PagerPhone"),
	PagerPhoneExtension: varchar("PagerPhoneExtension"),
	Email: varchar("Email"),
	Email1: varchar("Email1"),
	Email2: varchar("Email2"),
	Email3: varchar("Email3"),
	BillingAddressID: varchar("BillingAddressID"),
	BillingAddressLine1: varchar("BillingAddressLine1"),
	BillingAddressLine2: varchar("BillingAddressLine2"),
	BillingAddressLine3: varchar("BillingAddressLine3"),
	BillingAddressLine4: varchar("BillingAddressLine4"),
	BillingCity: varchar("BillingCity"),
	BillingCounty: varchar("BillingCounty"),
	BillingState: varchar("BillingState"),
	BillingZipCode: varchar("BillingZipCode"),
	BillingCountryCodeID: varchar("BillingCountryCodeID"),
	BillingCountry: varchar("BillingCountry"),
	HomeAddressID: varchar("HomeAddressID"),
	HomeAddressLine1: varchar("HomeAddressLine1"),
	HomeAddressLine2: varchar("HomeAddressLine2"),
	HomeAddressLine3: varchar("HomeAddressLine3"),
	HomeAddressLine4: varchar("HomeAddressLine4"),
	HomeCity: varchar("HomeCity"),
	HomeCounty: varchar("HomeCounty"),
	HomeState: varchar("HomeState"),
	HomeZipCode: varchar("HomeZipCode"),
	HomeCountry: varchar("HomeCountry"),
	HomePhoneID: varchar("HomePhoneID"),
	HomeCountryCodeID: varchar("HomeCountryCodeID"),
	HomeCountryCode: varchar("HomeCountryCode"),
	HomeAreaCode: varchar("HomeAreaCode"),
	HomePhone: varchar("HomePhone"),
	POBoxAddressID: varchar("POBoxAddressID"),
	POBox: varchar("POBox"),
	POBoxLine2: varchar("POBoxLine2"),
	POBoxLine3: varchar("POBoxLine3"),
	POBoxLine4: varchar("POBoxLine4"),
	POBoxCity: varchar("POBoxCity"),
	POBoxCounty: varchar("POBoxCounty"),
	POBoxState: varchar("POBoxState"),
	POBoxZipCode: varchar("POBoxZipCode"),
	POBoxCountryCodeID: varchar("POBoxCountryCodeID"),
	POBoxCountry: varchar("POBoxCountry"),
	SocialSecurity: varchar("SocialSecurity"),
	OrganizationID: varchar("OrganizationID"),
	MainAccountManager: varchar("MainAccountManager"),
	MainAccountManagerName: varchar("MainAccountManagerName"),
	Ranking: varchar("Ranking"),
	ReferredBy: varchar("ReferredBy"),
	ReferralType: varchar("ReferralType"),
	WebSite: varchar("WebSite"),
	Birthday: varchar("Birthday"),
	Supervisor: varchar("Supervisor"),
	AssistantsName: varchar("AssistantsName"),
	AssistantsPhoneID: varchar("AssistantsPhoneID"),
	AssistantsCountryCode: varchar("AssistantsCountryCode"),
	AssistantsAreaCode: varchar("AssistantsAreaCode"),
	AssistantsPhone: varchar("AssistantsPhone"),
	AssistantsExtension: varchar("AssistantsExtension"),
	Nickname: varchar("Nickname"),
	Gender: varchar("Gender"),
	SpouseName: varchar("SpouseName"),
	Kids: varchar("Kids"),
	ImportantDate1: varchar("ImportantDate1"),
	ImportantDescription1: varchar("ImportantDescription1"),
	ImportantDate2: varchar("ImportantDate2"),
	ImportantDescription2: varchar("ImportantDescription2"),
	ImportantDate3: varchar("ImportantDate3"),
	ImportantDescription3: varchar("ImportantDescription3"),
	Atmosphere: varchar("Atmosphere"),
	MailCode: varchar("MailCode"),
	CRRT: varchar("CRRT"),
	USCongress: varchar("USCongress"),
	StateSenate: varchar("StateSenate"),
	StateHouse: varchar("StateHouse"),
	CountyDistrict: varchar("CountyDistrict"),
	NextContactDate: varchar("NextContactDate"),
	MailExclude: varchar("MailExclude"),
	FaxExclude: varchar("FaxExclude"),
	EmailExclude: varchar("EmailExclude"),
	DirExclude: varchar("DirExclude"),
	PrefCommMethodID: varchar("PrefCommMethodID"),
	ContactManagerID: varchar("ContactManagerID"),
	VerifyStatus: varchar("VerifyStatus"),
	FunctionalTitle: varchar("FunctionalTitle"),
	ContactRank: varchar("ContactRank"),
	DirRank: varchar("DirRank"),
	PrimaryFunctionID: varchar("PrimaryFunctionID"),
	PrimaryFunction: varchar("PrimaryFunction"),
	MemberTypeID: varchar("MemberTypeID"),
	MemberType: varchar("MemberType"),
	JoinDate: varchar("JoinDate"),
	DuesPaidThru: varchar("DuesPaidThru"),
	LastDuesPaymentDate: varchar("LastDuesPaymentDate"),
	LastDuesAmount: varchar("LastDuesAmount"),
	TerminationDate: varchar("TerminationDate"),
	Status: varchar("Status"),
	CompanyMemberTypeID: varchar("CompanyMemberTypeID"),
	CoMemberType: varchar("CoMemberType"),
	CompanyMemberType: varchar("CompanyMemberType"),
	CompanyJoinDate: varchar("CompanyJoinDate"),
	CompanyDuesPaidThru: varchar("CompanyDuesPaidThru"),
	CompanyLastDuesPaymentDate: varchar("CompanyLastDuesPaymentDate"),
	CompanyLastDuesAmount: varchar("CompanyLastDuesAmount"),
	CompanyTerminationDate: varchar("CompanyTerminationDate"),
	OldID: varchar("OldID"),
	OldCompanyID: varchar("OldCompanyID"),
	GLOrderLevelID: varchar("GLOrderLevelID"),
	GLPaymentLevelID: varchar("GLPaymentLevelID"),
	CreditStatusID: varchar("CreditStatusID"),
	CreditLimit: varchar("CreditLimit"),
	BillingTerms: varchar("BillingTerms"),
	APVendorID: varchar("APVendorID"),
	PreferredCurrencyTypeID: varchar("PreferredCurrencyTypeID"),
	Directions: varchar("Directions"),
	Comments: varchar("Comments"),
	WhoCreated: varchar("WhoCreated"),
	WhoUpdated: varchar("WhoUpdated"),
	DateCreated: varchar("DateCreated"),
	DateUpdated: varchar("DateUpdated"),
	LastDuesAmountCurrencyTypeID: varchar("LastDuesAmountCurrencyTypeID"),
	CreditLimitCurrencyTypeID: varchar("CreditLimitCurrencyTypeID"),
	CompanyLastDuesAmountCurrencyTypeID: varchar("CompanyLastDuesAmountCurrencyTypeID"),
	MACPA_AICPANumber: varchar("MACPA_AICPANumber"),
	MACPA_AICPAMember: varchar("MACPA_AICPAMember"),
	MACPA_FederalTaxID: varchar("MACPA_FederalTaxID"),
	MACPA_MinorityGroup: varchar("MACPA_MinorityGroup"),
	MACPA_PriorName: varchar("MACPA_PriorName"),
	MACPA_Region: varchar("MACPA_Region"),
	MACPA_ReinstateDate: varchar("MACPA_ReinstateDate"),
	MACPA_BadgeCredentials: varchar("MACPA_BadgeCredentials"),
	MACPA_TerminationReasonID: varchar("MACPA_TerminationReasonID"),
	MACPA_TerminationReason: varchar("MACPA_TerminationReason"),
	MACPA_Legacy_BC: varchar("MACPA_Legacy_BC"),
	MACPA_Legacy_TY: varchar("MACPA_Legacy_TY"),
	MACPA_Legacy_ME: varchar("MACPA_Legacy_ME"),
	MACPA_GenderName: varchar("MACPA_GenderName"),
	MACPA_SecondaryJoinDate: varchar("MACPA_SecondaryJoinDate"),
	MACPA_LegacyChapter: varchar("MACPA_LegacyChapter"),
	MACPA_SpeakerStatus: varchar("MACPA_SpeakerStatus"),
	MACPA_SpeakerNotes: varchar("MACPA_SpeakerNotes"),
	MACPA_Bio: varchar("MACPA_Bio"),
	MACPA_BioLastUpdated: varchar("MACPA_BioLastUpdated"),
	MACPA_MemberStatus: varchar("MACPA_MemberStatus"),
	MACPA_StatusType: varchar("MACPA_StatusType"),
	CPAStateCensus: varchar("CPAStateCensus"),
	CPADistrictCode: varchar("CPADistrictCode"),
	CPADistrictTypeID: varchar("CPADistrictTypeID"),
	CPADistrictType: varchar("CPADistrictType"),
	CPAPoliticalPartyID: varchar("CPAPoliticalPartyID"),
	CPAPoliticalParty: varchar("CPAPoliticalParty"),
	CPALegislatorID: varchar("CPALegislatorID"),
	CPAIsActiveLegislator: varchar("CPAIsActiveLegislator"),
	MACPA_LegacyUSCongress: varchar("MACPA_LegacyUSCongress"),
	MACPA_LegacyStateSenate: varchar("MACPA_LegacyStateSenate"),
	MACPA_LegacyStateHouse: varchar("MACPA_LegacyStateHouse"),
	MACPA_CPETotalAA: varchar("MACPA_CPETotalAA"),
	MACPA_CPETotalET: varchar("MACPA_CPETotalET"),
	MACPA_CPETotalOT: varchar("MACPA_CPETotalOT"),
	MACPA_CPETotalDLAA: varchar("MACPA_CPETotalDLAA"),
	MACPA_CPETotalDLET: varchar("MACPA_CPETotalDLET"),
	MACPA_CPETotalDLOT: varchar("MACPA_CPETotalDLOT"),
	MACPA_CPETotal: varchar("MACPA_CPETotal"),
	CPAPersonalFaxID: varchar("CPAPersonalFaxID"),
	CPAPersonalFaxCountryCode: varchar("CPAPersonalFaxCountryCode"),
	CPAPersonalFaxAreaCode: varchar("CPAPersonalFaxAreaCode"),
	CPAPersonalFaxPhone: varchar("CPAPersonalFaxPhone"),
	MACPA_CreditMemoTotal: varchar("MACPA_CreditMemoTotal"),
	MACPA_NoSuggestedPAC: varchar("MACPA_NoSuggestedPAC"),
	MACPA_PACAgreementExemption: varchar("MACPA_PACAgreementExemption"),
	MACPA_PACCoalition: varchar("MACPA_PACCoalition"),
	MACPA_CompanyType: varchar("MACPA_CompanyType"),
	MACPA_BadgeName: varchar("MACPA_BadgeName"),
	MACPA_PACRibbon: varchar("MACPA_PACRibbon"),
	MACPA_ReviewerPR: varchar("MACPA_ReviewerPR"),
	MACPA_TechnicalReviewerPR: varchar("MACPA_TechnicalReviewerPR"),
	MACPA_NoPACDonations: varchar("MACPA_NoPACDonations"),
	MACPA_FullName: varchar("MACPA_FullName"),
	MACPA_PreferredAddressID: varchar("MACPA_PreferredAddressID"),
	MACPA_PreferredAddressLine1: varchar("MACPA_PreferredAddressLine1"),
	MACPA_PreferredAddressLine2: varchar("MACPA_PreferredAddressLine2"),
	MACPA_PreferredAddressLine3: varchar("MACPA_PreferredAddressLine3"),
	MACPA_PreferredAddressLine4: varchar("MACPA_PreferredAddressLine4"),
	MACPA_PreferredCity: varchar("MACPA_PreferredCity"),
	MACPA_PreferredState: varchar("MACPA_PreferredState"),
	MACPA_PreferredZip: varchar("MACPA_PreferredZip"),
	MACPA_PreferredCounty: varchar("MACPA_PreferredCounty"),
	MACPA_PreferredCountry: varchar("MACPA_PreferredCountry"),
	MACPA_JoinDate: varchar("MACPA_JoinDate"),
	OrderTotal__fvc: varchar("OrderTotal__fvc"),
	BalanceDue__fvc: varchar("BalanceDue__fvc"),
	MACPA_BalanceDue: varchar("MACPA_BalanceDue"),
	MACPA_IsCurrentLegislator: varchar("MACPA_IsCurrentLegislator"),
	MACPA_LegislatorDistrictType: varchar("MACPA_LegislatorDistrictType"),
	MACPA_LegislatorDistrict: varchar("MACPA_LegislatorDistrict"),
	MACPA_LegislatorID: varchar("MACPA_LegislatorID"),
	MACPA_LegislativePrefix: varchar("MACPA_LegislativePrefix"),
	MACPA_LegislativeSuffix: varchar("MACPA_LegislativeSuffix"),
	MACPA_LegPrintFlag: varchar("MACPA_LegPrintFlag"),
	MACPA_NotEligibleForMembership: varchar("MACPA_NotEligibleForMembership"),
	Photo: varchar("Photo"),
	BillingBadAddress: varchar("BillingBadAddress"),
	HomeBadAddress: varchar("HomeBadAddress"),
	POBoxBadAddress: varchar("POBoxBadAddress"),
	BusinessBadAddress: varchar("BusinessBadAddress"),
	MACPA_ImportSource: varchar("MACPA_ImportSource"),
	MACPA_CurrentUSHouse__c: varchar("MACPA_CurrentUSHouse__c"),
	MACPA_CurrentMISenate__c: varchar("MACPA_CurrentMISenate__c"),
	MACPA_CurrentMIHouse__c: varchar("MACPA_CurrentMIHouse__c"),
	MACPA_PastUSHouse__c: varchar("MACPA_PastUSHouse__c"),
	MACPA_PastMISenate__c: varchar("MACPA_PastMISenate__c"),
	MACPA_PastMIHouse__c: varchar("MACPA_PastMIHouse__c"),
	KWPersonID: varchar("KWPersonID"),
	LegislatorReviewRequired: varchar("LegislatorReviewRequired"),
	ExternalAccountProfileURL: varchar("ExternalAccountProfileURL"),
	IgnoreSocialNetworkCompanyDifferences: varchar("IgnoreSocialNetworkCompanyDifferences"),
	IgnoreSocialNetworkTitleDifferences: varchar("IgnoreSocialNetworkTitleDifferences"),
	IsGroupAdmin: varchar("IsGroupAdmin"),
	MACPA_IsMember: varchar("MACPA_IsMember"),
	MICPA_MailBallot: varchar("MICPA_MailBallot"),
	MICPA_DuesMessage: varchar("MICPA_DuesMessage"),
	MICPA_FirmAdmin: varchar("MICPA_FirmAdmin"),
	MICPA_ExcludeFirmRoster: varchar("MICPA_ExcludeFirmRoster"),
	DuesAutoIsActive__fvc: varchar("DuesAutoIsActive__fvc"),
	CESScore: varchar("CESScore"),
	SpaceLinkHandle: varchar("SpaceLinkHandle"),
	StatusName: varchar("StatusName"),
	FormattedAddress: varchar("FormattedAddress"),
	FormattedPhone: varchar("FormattedPhone"),
	IsSystem: varchar("IsSystem"),
	MICPA_ImportDate1: varchar("MICPA_ImportDate1"),
	MICPA_ImportDate2: varchar("MICPA_ImportDate2"),
	MICPA_FormattedCellPhone: varchar("MICPA_FormattedCellPhone"),
	Micpa_AbsorbLMSID: varchar("Micpa_AbsorbLMSID"),
	eStoreID: varchar("eStoreID"),
	VIP_MICPA: varchar("VIP_MICPA"),
	ScholarshipWinner: varchar("ScholarshipWinner"),
	MICPA_PeerReviewProfessional: varchar("MICPA_PeerReviewProfessional"),
	MICPA_OverridePAC: varchar("MICPA_OverridePAC"),
	OriginalLicenseDate_pb: varchar("OriginalLicenseDate_pb"),
});

export const vwMeetingAttendees = pgTable("vwMeetingAttendees", {
	ID: varchar("ID"),
	Registrant: varchar("Registrant"),
	Company: varchar("Company"),
	TravellingFrom: varchar("TravellingFrom"),
	Arriving: varchar("Arriving"),
	Departing: varchar("Departing"),
	Airline: varchar("Airline"),
	Hotel: varchar("Hotel"),
	OrderID: varchar("OrderID"),
	MeetingID: varchar("MeetingID"),
	ActualMeetingID: varchar("ActualMeetingID"),
	NameWCompany: varchar("NameWCompany"),
});

export const vwPersonCPALicenses = pgTable("vwPersonCPALicenses", {
	ID: varchar("ID"),
	PersonID: varchar("PersonID"),
	Sequence: varchar("Sequence"),
	LicenseTypeID: varchar("LicenseTypeID"),
	LicenseType: varchar("LicenseType"),
	LicenseNo: varchar("LicenseNo"),
	LicenseDate: varchar("LicenseDate"),
	LicenseState: varchar("LicenseState"),
	LicenseStatusID: varchar("LicenseStatusID"),
	LicenseStatus: varchar("LicenseStatus"),
	ExpirationDate: varchar("ExpirationDate"),
	MICPA_LARAStatus: varchar("MICPA_LARAStatus"),
	MICPA_LastRenewalDate: varchar("MICPA_LastRenewalDate"),
});

export const vwTopicCodeLinks = pgTable("vwTopicCodeLinks", {
	ID: varchar("ID"),
	TopicCodeID: varchar("TopicCodeID"),
	TopicCodeID_Name: varchar("TopicCodeID_Name"),
	EntityID: varchar("EntityID"),
	RecordID: varchar("RecordID"),
	RecordName: varchar("RecordName"),
	Value: varchar("Value"),
	Status: varchar("Status"),
	DateAdded: varchar("DateAdded"),
});

export const vwEducationUnits = pgTable("vwEducationUnits", {
	ID: varchar("ID"),
	PersonID: varchar("PersonID"),
	Person: varchar("Person"),
	DateEarned: varchar("DateEarned"),
	DateExpires: varchar("DateExpires"),
	EducationCategoryID: varchar("EducationCategoryID"),
	EducationCategory: varchar("EducationCategory"),
	PrimaryFunctionID: varchar("PrimaryFunctionID"),
	PrimaryFunction: varchar("PrimaryFunction"),
	Status: varchar("Status"),
	EducationUnits: varchar("EducationUnits"),
	OrderMeetingDetailID: varchar("OrderMeetingDetailID"),
	OrderLineID: varchar("OrderLineID"),
	OrderID: varchar("OrderID"),
	Sequence: varchar("Sequence"),
	OrderMeetingDetailEducationUnitsID: varchar("OrderMeetingDetailEducationUnitsID"),
	Source: varchar("Source"),
	ExternalSource: varchar("ExternalSource"),
	ExternalSourceDescription: varchar("ExternalSourceDescription"),
	ExternalSourceVerified: varchar("ExternalSourceVerified"),
	MeetingID: varchar("MeetingID"),
	ProductID: varchar("ProductID"),
	Meeting: varchar("Meeting"),
	MACPA_LegacyProductID: varchar("MACPA_LegacyProductID"),
	AuraSelectDate: varchar("AuraSelectDate"),
	AuraDeactivate: varchar("AuraDeactivate"),
	AuraExternalCpeCity: varchar("AuraExternalCpeCity"),
	AuraExternalCpeSponsor: varchar("AuraExternalCpeSponsor"),
	AuraExternalCpeInstructor: varchar("AuraExternalCpeInstructor"),
	MACPA_CourseType: varchar("MACPA_CourseType"),
	MACPA_CarryOver: varchar("MACPA_CarryOver"),
	MACPA_SponsorID: varchar("MACPA_SponsorID"),
	MACPA_Comments: varchar("MACPA_Comments"),
	MACPA_CreditDate: varchar("MACPA_CreditDate"),
	MACPA_ProductCategoryID: varchar("MACPA_ProductCategoryID"),
	WebinarVendorID: varchar("WebinarVendorID"),
	MACPA_PenaltyHours: varchar("MACPA_PenaltyHours"),
	MICPA_Relicensure: varchar("MICPA_Relicensure"),
	DateCreated: varchar("DateCreated"),
	WhoCreated: varchar("WhoCreated"),
	DateUpdated: varchar("DateUpdated"),
	WhoUpdated: varchar("WhoUpdated"),
	eStoreID: varchar("eStoreID"),
	ClassRegistrationID: varchar("ClassRegistrationID"),
	Score: varchar("Score"),
});
