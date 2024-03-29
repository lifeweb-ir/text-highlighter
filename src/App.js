import React from "react";
import Highlighter from "./Highlight";

const App = () => {
  return (
    <div style={{
        direction:"rtl"
    }}>
      <Highlighter
        caseSensitive={false}
        searchWords={[
          { text: "علی", onClick: (w)=> console.log(w) },
          { text: "تصویب", onClick: (w)=> console.log(w) },
          { text: "(?:^| )(@\\w+)", onClick: (w)=> console.log(w) },
          { text: "(#.*?)\\s+", onClick: (w)=> console.log(w) },
        ]}
        textToHighlight={"@ab_ganji می‌دانستی از زمانی که پرونده هسته ای ایران به شورای امنیت سازمان ملل ارجاع داده شد ، 6 قطعنامه علیه کشورمان به تصویب رسیده است ؟\nقطعنامه (1737)\nقطعنامه تحریمی (1747)\nقطعنامه تحریمی (1803)\nقطعنامه تحریمی (1835)\nقطعنامه تحریمی (1887)\nقطعنامه تحریمی (1929)\n6 گام به عقب\nچه عدد اشنایی !؟ 6. @maryam_rajavi_p 🔵 عمق کینه اخوندا به #الخو_ویدال_کوادراس را میتوان در این حمله زبونانه تروریستی شناخت بخصوص که « او » نقش کلیدی در خارج‌کردن نام مجاهدین از لیست تروریستی و انتقال امن و دستجمعی انها به خارج از عراق ایفا کرد\n" +
        "@vidalquadras\n" +
        "#alejovidalcuadras https://t,co/eafpwhf535 @maryam_rajavi_p 🔵 عمق کینه اخوندا به #الخو_ویدال_کوادراس را میتوان در این حمله زبونانه تروریستی شناخت بخصوص که « او » نقش کلیدی در خارج‌کردن نام مجاهدین از لیست تروریستی و انتقال امن و دستجمعی انها به خارج از عراق ایفا کرد\\n@vidalquadras\\n#alejovidalcuadras https://t.co/eafpwhf535"}
      />13
    </div>
  );
};

export default App;
