LIB_PROJECT_DIR="$HOME/projects/smart_thing/smart_thing_lib"
HEADER_DIR="$LIB_PROJECT_DIR/lib/smartthing/src/net/rest"

if [ ! -d "$HEADER_DIR" ]; then
  echo 
fi && \
scp -r ./dist/WebPageAssets.h $HEADER_DIR/WebPageAssets.h && \
echo "Copied header file WebPageAssets.h in $HEADER_DIR"