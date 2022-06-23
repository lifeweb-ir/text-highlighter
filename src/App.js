import React from "react";
import Highlighter from "./Highlight";

const App = () => {
  return (
    <div>
      <Highlighter
        caseSensitive={true}
        searchWords={[{ text: "Text2" }]}
        textToHighlight={"Text1 Text2 Tex3Text2Text4"}
      />
    </div>
  );
};

export default App;
