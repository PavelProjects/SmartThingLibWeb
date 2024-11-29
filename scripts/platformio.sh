if [ -z $npm_config_dest ];
then
  LIB_DIR="$HOME/projects/smart_thing/smart_thing_lib/lib/smartthing"
else
  LIB_DIR="$npm_config_dest"
fi

FULL_PATH="$LIB_DIR/src/net/rest"

if [ ! -d "$FULL_PATH" ]; then
  echo "Bad destanation path: $LIB_DIR (resolved to $FULL_PATH)"
  exit 1
fi

scp -r ./dist/WebPageAssets.h $FULL_PATH/WebPageAssets.h
if [ $? -eq 0 ]; then
  echo "Copied header file WebPageAssets.h in $FULL_PATH"
else
  echo "Failed to deploy header file"
  exit 1
fi