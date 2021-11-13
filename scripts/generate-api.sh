#!/bin/bash -e
cd "$(dirname $0)/.."

# Fetch OpenAPI Schema an generate api client
exec npx @openapitools/openapi-generator-cli generate \
    -i http://genie-ar.ch/api/schema/ \
    -o src/api/ \
    -g typescript-fetch \
    --additional-properties=typescriptThreePlus=true
