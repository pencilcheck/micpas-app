#!/usr/bin/env bash

DB=postgres://postgres:hydra@u8ccowkccso0cgw4oc0c00c4.aeloda.com:6543/postgres
FILE=$( dirname "${BASH_SOURCE[0]}" )/create_refresh_all_mviews.sql

create_refresh_mviews() {
  set +e # ignore error such as relation doesn't exists yet
  echo ${FILE}
  psql ${DB} -f ${FILE}
  echo Done creating views
  set -e
}

create_refresh_mviews
