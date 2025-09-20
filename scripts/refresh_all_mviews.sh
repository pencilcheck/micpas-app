#!/usr/bin/env bash

DB=postgres://postgres:hydra@u8ccowkccso0cgw4oc0c00c4.aeloda.com:6543/postgres
FILE=$( dirname "${BASH_SOURCE[0]}" )/refresh_all_mviews.sql

refresh_mviews() {
  set +e # ignore error such as relation doesn't exists yet
  echo ${FILE}
  psql ${DB} -f ${FILE}
  echo Done refreshing
  set -e
}

refresh_mviews
echo $?
