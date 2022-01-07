import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import xlsx from "xlsx";

function DataImporter(props) {
	const {
		_width = 160,
		_height = 160,
		uploadTrue = false,
		onEmptyFile = () => {},
		onError = () => {},
		onSample = () => {},
		onUpload = () => {},
		worksheetHaveHeaders = false,
		borderColor = "grey",
		borderType = "dashed",
		borderWidth = 1,
		backgroundColor,
		textToDisplay = "Drag or drop here, or ",
		browseTextToDiplay = "Browse",
		styles = {
			textToDisplay: {
				fontFamily: "arial",
				fontWeight: "600",
				color: "black"
			},
			browseTextToDiplay: {
				fontFamily: "arial",
				fontWeight: "600",
				color: "black"
			}
		},
		...rest 
	} = props
  const [dragging, useDragging] = useState(false);
  const [fileObject, setFileObject] = useState();
  const fileUploadRef = useRef(null);
  let dragCounter = 0;
	console.log(styles) 
  useEffect(() => {
    if (uploadTrue && fileObject) {
			console.log(fileObject)
      fileObject.forEach((row, index) => {
				const args = [...Array(3).keys()].flatMap((item) => {
					const keys = Object.keys(row);
					return [...Array(15).keys()].map((index) => {
						switch (item) {
							case 0:
								return row[keys[index]] || "";
							case 1:
								return isNaN(row[keys[index]])
									? 0
									: Number(row[keys[index]]);
							case 2:
								return isNaN(Date.parse(row[keys[index]]))
									? new Date(0).toISOString()
									: new Date(row[keys[index]]).toISOString();
						}
					});
				});
				console.log(args);
				onUpload(index + 1, fileObject.length, ...args);
			});
    } else if (uploadTrue) {
      onError("NO_FILE_SELECTED");
    }
  }, [uploadTrue, fileObject]);

  const DragEnterHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    const dataTransfer = e.dataTransfer;
    useDragging((drag) => {
      if (dataTransfer && dataTransfer.items && dataTransfer.items.length > 0) {
        return true;
      }
      return drag;
    });
  };

  const DragLeaveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    useDragging((drag) => {
      if (dragCounter !== 0) {
        return false;
      }
      return drag;
    });
  };

  const DropEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    useDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      handleUpload(files);
      dragCounter = 0;
    }
  };

  const handleUpload = (files) => {
    if (!files.length) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e);
      if (e.target) {
        const wb = xlsx.read(e.target.result, { type: "binary" });
        wb.SheetNames.forEach((sheet) => {
          const csv = xlsx.utils.sheet_to_json(wb.Sheets[sheet]);
          if (csv.length === 0 || (csv.length === 1 && worksheetHaveHeaders)) {
            onEmptyFile();
          } else {
            if (worksheetHaveHeaders) {
              csv.shift();
            }
            const args = [...Array(3).keys()].flatMap((item) => {
              const keys = Object.keys(csv[0]);
              return [...Array(15).keys()].map((index) => {
                switch (item) {
                  case 0:
                    return csv[0][keys[index]] || "";
                  case 1:
                    return isNaN(csv[0][keys[index]])
                      ? 0
                      : Number(csv[0][keys[index]]);
                  case 2:
                    return isNaN(Date.parse(csv[0][keys[index]]))
                      ? new Date(0).toISOString()
                      : new Date(csv[0][keys[index]]).toISOString();
                }
              });
            });
            console.log(args);
            onSample(csv.length, ...args);
            setFileObject(csv);
          }
        });
      }
    };

    reader.readAsBinaryString(files[0]);
  };
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnter={DragEnterHandler}
      onDragLeave={DragLeaveHandler}
      onDrop={DropEventHandler}
    >
      <div
        style={{
					backgroundColor,
          borderColor,
					borderStyle: borderType,
					borderWidth,
          height: _height,
          width: _width,
          display: "grid",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {!dragging && (
          <>
            <div>
              <span style={{ color: styles.textToDisplay?.color, fontFamily: styles.textToDisplay?.fontFamily, fontWeight: styles.textToDisplay?.fontWeight }}>{textToDisplay}</span>
              <a
                style={{ 
									color: styles.browseTextToDiplay?.color, fontFamily: styles.browseTextToDiplay?.fontFamily, fontWeight: styles.browseTextToDiplay?.fontWeight
								 }}
                onClick={() => fileUploadRef.current?.click()}
              >
                {browseTextToDiplay}
              </a>
            </div>
            <input
              hidden={true}
              ref={fileUploadRef}
              onChange={(e) => {
                if (e.target.files) {
                  handleUpload(e.target.files);
                }
              }}
              type="file"
              id="myFile"
              name="filename"
            />
          </>
        )}
        {dragging && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              left: 0,
              textAlign: "center",
              color: "grey",
              fontSize: 36,
              transform: "translateY(-50%)",
            }}
          >
            <div>drop here :)</div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DataImporter;
