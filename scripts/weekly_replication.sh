#!/usr/bin/env bash

SOURCE_PATH=postgresql://tenniswinner555:gEhat5cX0nvF@ep-wandering-sea-43477426-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DEST_PATH=postgres://u5q355384235:2JWqApUfeeIRtiONwz5aStOcJKFn6KLsbUr5MIa9E9lKih3tPYchx67e77NCoTOZ@hy-280c8257-d029-428f-aabe-8dae0084caa2.us-east-1.aws.hydradb.io:5432/d9q763114527?sslmode=require

# ONLY for "vwEducationUnits" since we use append only on it
dedup_source() {
  set +e # ignore error such as relation doesn't exists yet
  psql ${SOURCE_PATH} -c "
    DELETE FROM \"vwEducationUnits\"
    WHERE \"ID\" IN
        (SELECT \"ID\"
        FROM 
            (SELECT \"ID\",
             ROW_NUMBER() OVER( PARTITION BY \"ID\"
            ORDER BY \"ID\" ) AS row_num
            FROM \"vwEducationUnits\" ) t
            WHERE t.row_num > 1 );
  "
  set -e
}

truncate_dest() {
  set +e # ignore error such as relation doesn't exists yet
  psql ${DEST_PATH} -c 'TRUNCATE "vwMeetingAttendees"; TRUNCATE "vwPersonCPALicenses"; TRUNCATE "vwPersons"; TRUNCATE "vwTopicCodeLinks"; TRUNCATE "vwEducationUnits";'
  set -e
}

dump_and_pipe() {
  # -a (insert only) will error out for those with table not created, remove -a will have error about table already exist but it should pass
  pg_dump -Fc -v -t '"vwMeetingAttendees"' -t '"vwPersonCPALicenses"' -t '"vwTopicCodeLinks"' -t '"vwPersons"' -t '"vwEducationUnits"' -d ${SOURCE_PATH} | pg_restore -v -d ${DEST_PATH}
}

dedup_source && truncate_dest && dump_and_pipe
