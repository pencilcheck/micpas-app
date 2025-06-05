#!/usr/bin/env bash

SOURCE_PATH=postgresql://tenniswinner555:gEhat5cX0nvF@ep-wandering-sea-43477426-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DEST_PATH=postgres://postgres:hydra@u8ccowkccso0cgw4oc0c00c4.aeloda.com:6543/postgres

truncate_dest() {
  #psql ${DEST_PATH} -c 'TRUNCATE "vwPersons"; TRUNCATE "vwMeetings"; TRUNCATE "vwProducts"; TRUNCATE "vwCampaigns"; TRUNCATE "vwEducationUnits";'
  set +e # ignore error such as relation doesn't exists yet
  psql ${DEST_PATH} -c 'TRUNCATE "vwPersonsPartitions";'
  set -e
}

dump_and_pipe() {
  # -a (insert only) will error out for those with table not created, remove -a will have error about table already exist but it should pass
  pg_dump -t '"vwPersonsPartitions"_*' -d ${SOURCE_PATH} | psql ${DEST_PATH}
}

truncate_dest && dump_and_pipe
echo $?
