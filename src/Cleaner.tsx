// @ts-nocheck
import {useEffect, useRef} from "react";
import {Editor} from "@tinymce/tinymce-react";

export default function Cleaner() {
  const editorRef = useRef(null);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("drop-overlay")?.classList.add("drag-over");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("drop-overlay")?.classList.remove("drag-over");

      const file = e.dataTransfer.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editorRef.current?.setContent(e.target?.result);
        };
        reader.readAsText(file);
      }
    };

    const handleDragLeave = () => {
      document.getElementById("drop-overlay")?.classList.remove("drag-over");
    };

    document.body.addEventListener("dragover", handleDragOver);
    document.body.addEventListener("drop", handleDrop);
    document.body.addEventListener("dragleave", handleDragLeave);

    return () => {
      document.body.removeEventListener("dragover", handleDragOver);
      document.body.removeEventListener("drop", handleDrop);
      document.body.removeEventListener("dragleave", handleDragLeave);
    };
  });
  return (
    <>
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        init={{
          menubar: false,
          draggable_modal: false,
          paste_data_images: false,
          paste_block_drop: false,
          plugins: [
            "table",
            "autoresize",
            "code",
            "contextmenu",
            "nonbreaking",
            "paste",
            "visualchars",
          ],
          toolbar:
            "table tablerowprops tablecellprops tablemergecells | alignnone alignright | nonbreaking visualchars | preparetable code",
          table_toolbar:
            "tablerowprops tablecellprops tablemergecells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol", // b
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <div
        style={{
          padding: "25px",
          display: "flex",
          background: "#f0f0f0",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          position: "relative",
        }}
      >
        <div
          id="drop-overlay"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 9999,
            transition: "background-color 0.2s",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#000",
              fontSize: "16px",
              fontWeight: "bold",
              display: "none",
            }}
          >
            Drop file here
          </p>
        </div>
        <input
          type="file"
          accept=".html"
          key={Date.now()}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const content = e.target?.result as string;
                if (editorRef.current) {
                  editorRef.current.setContent(content);
                }
              };
              reader.readAsText(file);
              e.target.value = "";
            }
          }}
        />
        <button
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
          }}
          onClick={() => {
            if (editorRef.current) {
              const content = editorRef.current.getContent();
              const blob = new Blob([content], {type: "text/html"});
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "content.html";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }}
        >
          Export HTML
        </button>
      </div>
    </>
  );
}
