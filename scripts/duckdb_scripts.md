Inside duckdb:

ATTACH 'dbname=d9q763114527 user=u5q355384235 password=2JWqApUfeeIRtiONwz5aStOcJKFn6KLsbUr5MIa9E9lKih3tPYchx67e77NCoTOZ host=hy-280c8257-d029-428f-aabe-8dae0084caa2.us-east-1.aws.hydradb.io' AS postgres_db (TYPE POSTGRES);

Then

CREATE TABLE postgres_db.vwEducationUnits AS SELECT * FROM read_parquet('vwEducationUnits.parquet');
