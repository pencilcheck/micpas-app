SELECT
  CAST("ID" as varchar) as "ID",
  CAST("Registrant" as varchar) as "Registrant",
  CAST("Company" as varchar) as "Company",
  CAST("TravellingFrom" as varchar) as "TravellingFrom",
  CAST("Arriving" as varchar) as "Arriving",
  CAST("Departing" as varchar) as "Departing",
  CAST("Airline" as varchar) as "Airline",
  CAST("Hotel" as varchar) as "Hotel",
  CAST("OrderID" as varchar) as "OrderID",
  CAST("MeetingID" as varchar) as "MeetingID",
  CAST("ActualMeetingID" as varchar) as "ActualMeetingID",
  CAST("NameWCompany" as varchar) as "NameWCompany"
FROM [APTIFY].[dbo].[vwMeetingAttendees]
