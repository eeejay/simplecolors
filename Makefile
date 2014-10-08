APP?=fennec
ADB?=${shell which adb}
PACKAGE_JSON = package.json
LIB_SOURCES = $(shell find lib/ -not -name \*~)

SOURCES = \
	$(PACKAGE_JSON) \
	$(LIB_SOURCES)

EXT_NAME := \
	${shell python -c "import json; print json.load(open('$(PACKAGE_JSON)'))['name'],"}
EXT_VERSION := \
	${shell python -c "import json; print json.load(open('$(PACKAGE_JSON)'))['version'],"}

XPI_FILE := $(EXT_NAME)-$(EXT_VERSION).xpi

$(XPI_FILE): $(SOURCES)
	@cfx xpi --output-file=$@
	@unzip -p $@ install.rdf | \
	  sed -e "s/ Firefox / Firefox for Android /g" | \
	  sed -e s/ec8030f7-c20a-464f-9b0e-13a3a9e97384/aa3c5121-dab2-40e2-81ca-7ea25febc110/ > \
	  install.rdf
	@zip $@ install.rdf
	@rm install.rdf

all: $(XPI_FILE)

clean:
	rm -f *.xpi

run:
	cfx run -a fennec-on-device -b $(ADB) --mobile-app $(APP) --force-mobile