SELECT
  CAST("ID" as varchar) as "ID",
  CAST("PersonID" as varchar) as "PersonID",
  CAST("Person" as varchar) as "Person",
  CAST("DateEarned" as varchar) as "DateEarned",
  CAST("DateExpires" as varchar) as "DateExpires",
  CAST("EducationCategoryID" as varchar) as "EducationCategoryID",
  CAST("EducationCategory" as varchar(220)) as "EducationCategory",
  CAST("PrimaryFunctionID" as varchar) as "PrimaryFunctionID",
  CAST("PrimaryFunction" as varchar) as "PrimaryFunction",
  CAST("Status" as varchar) as "Status",
  CAST("EducationUnits" as varchar) as "EducationUnits",
  CAST("OrderMeetingDetailID" as varchar) as "OrderMeetingDetailID",
  CAST("OrderLineID" as varchar) as "OrderLineID",
  CAST("OrderID" as varchar) as "OrderID",
  CAST("Sequence" as varchar) as "Sequence",
  CAST("OrderMeetingDetailEducationUnitsID" as varchar) as "OrderMeetingDetailEducationUnitsID",
  CAST("Source" as varchar) as "Source",
  CAST("ExternalSource" as varchar) as "ExternalSource",
  CAST("ExternalSourceDescription" as varchar) as "ExternalSourceDescription",
  CAST("ExternalSourceVerified" as varchar) as "ExternalSourceVerified",
  CAST("MeetingID" as varchar) as "MeetingID",
  CAST("ProductID" as varchar) as "ProductID",
  CAST("Meeting" as varchar) as "Meeting",
  CAST("MACPA_LegacyProductID" as varchar) as "MACPA_LegacyProductID",
  CAST("AuraSelectDate" as varchar) as "AuraSelectDate",
  CAST("AuraDeactivate" as varchar) as "AuraDeactivate",
  CAST("AuraExternalCpeCity" as varchar) as "AuraExternalCpeCity",
  CAST("AuraExternalCpeSponsor" as varchar) as "AuraExternalCpeSponsor",
  CAST("AuraExternalCpeInstructor" as varchar) as "AuraExternalCpeInstructor",
  CAST("MACPA_CourseType" as varchar) as "MACPA_CourseType",
  CAST("MACPA_CarryOver" as varchar) as "MACPA_CarryOver",
  CAST("MACPA_SponsorID" as varchar) as "MACPA_SponsorID",
  CAST("MACPA_Comments" as varchar) as "MACPA_Comments",
  CAST("MACPA_CreditDate" as varchar) as "MACPA_CreditDate",
  CAST("MACPA_ProductCategoryID" as varchar) as "MACPA_ProductCategoryID",
  CAST("WebinarVendorID" as varchar) as "WebinarVendorID",
  CAST("MACPA_PenaltyHours" as varchar) as "MACPA_PenaltyHours",
  CAST("MICPA_Relicensure" as varchar) as "MICPA_Relicensure",
  CAST("DateCreated" as varchar) as "DateCreated",
  CAST("WhoCreated" as varchar) as "WhoCreated",
  CAST("DateUpdated" as varchar) as "DateUpdated",
  CAST("WhoUpdated" as varchar) as "WhoUpdated",
  CAST("eStoreID" as varchar) as "eStoreID",
  CAST("ClassRegistrationID" as varchar) as "ClassRegistrationID",
  CAST("Score" as varchar) as "Score"
FROM [APTIFY].[dbo].[vwEducationUnits]
WHERE DateEarned >= '2021-04-01 00:00:00.000'