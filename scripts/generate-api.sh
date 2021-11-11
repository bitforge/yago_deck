#!/bin/bash -e
cd "$(dirname $0)/.."

# Install openapi-generator:
# npm install -g @openapitools/openapi-generator-cli

exec openapi-generator-cli generate \
    -i http://genie-ar.ch/api/schema/ \
    -o src/api/ \
    -g typescript-fetch \
    --additional-properties=typescriptThreePlus=true