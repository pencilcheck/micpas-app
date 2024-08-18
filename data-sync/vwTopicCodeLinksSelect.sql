SELECT
  CAST("ID" as varchar) as "ID",
  CAST("TopicCodeID" as varchar) as "TopicCodeID",
  CAST("TopicCodeID_Name" as varchar) as "TopicCodeID_Name",
  CAST("EntityID" as varchar) as "EntityID",
  CAST("RecordID" as varchar) as "RecordID",
  CAST("RecordName" as varchar) as "RecordName",
  CAST("Value" as varchar) as "Value",
  CAST("Status" as varchar) as "Status",
  CAST("DateAdded" as varchar) as "DateAdded"
FROM [APTIFY].[dbo].[vwTopicCodeLinks]
