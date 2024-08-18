SELECT
  CAST("ID" as varchar) as "ID",
  CAST("PersonID" as varchar) as "PersonID",
  CAST("Sequence" as varchar) as "Sequence",
  CAST("LicenseTypeID" as varchar) as "LicenseTypeID",
  CAST("LicenseType" as varchar) as "LicenseType",
  CAST("LicenseNo" as varchar) as "LicenseNo",
  CAST("LicenseDate" as varchar) as "LicenseDate",
  CAST("LicenseState" as varchar) as "LicenseState",
  CAST("LicenseStatusID" as varchar) as "LicenseStatusID",
  CAST("LicenseStatus" as varchar) as "LicenseStatus",
  CAST("ExpirationDate" as varchar) as "ExpirationDate",
  CAST("MICPA_LARAStatus" as varchar) as "MICPA_LARAStatus",
  CAST("MICPA_LastRenewalDate" as varchar) as "MICPA_LastRenewalDate"
FROM [APTIFY].[dbo].[vwPersonCPALicenses]
