#!/bin/bash -e
cd "$(dirname $0)/.."
exec npx prettier --write src