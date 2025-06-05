#!/usr/bin/env bash

SOURCE_PATH=postgresql://tenniswinner555:gEhat5cX0nvF@ep-wandering-sea-43477426-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DEST_PATH=postgres://postgres:hydra@u8ccowkccso0cgw4oc0c00c4.aeloda.com:6543/postgres

truncate_dest() {
  set +e # ignore error such as relation doesn't exists yet
  psql ${DEST_PATH} -c 'TRUNCATE "vwMeetingAttendees";'
  psql ${DEST_PATH} -c 'TRUNCATE "vwPersonCPALicenses";'
  psql ${DEST_PATH} -c 'TRUNCATE "vwPersons";'
  psql ${DEST_PATH} -c 'TRUNCATE "vwTopicCodeLinks";'
  psql ${DEST_PATH} -c 'TRUNCATE "vwEducationUnits";'
  psql ${DEST_PATH} -c 'TRUNCATE "vwOrders";'
  psql ${DEST_PATH} -c 'TRUNCATE "vwOrderDetails";'
  set -e
}

dump_and_pipe() {
  # -a (insert only) will error out for those with table not created, remove -a will have error about table already exist but it should pass
  pg_dump -Fc -v -t '"vwMeetingAttendees"' -t '"vwPersonCPALicenses"' -t '"vwTopicCodeLinks"' -t '"vwPersons"' -t '"vwEducationUnits"' -t '"vwOrders"' -t '"vwOrderDetails"' -d ${SOURCE_PATH} | pg_restore -v -d ${DEST_PATH}
}

truncate_dest && dump_and_pipe
