import React from "react";

type StructuredDataProps = {
  data: Record<string, unknown>;
};

function renderMicrodataItem(item: Record<string, unknown>, itemType: string, key?: string) {
  const children: React.ReactNode[] = [];
  let childIndex = 0;

  for (const [key, value] of Object.entries(item)) {
    if (key.startsWith("@")) continue;

    const items = Array.isArray(value) ? value : [value];
    for (const v of items) {
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        const nestedType = (v as Record<string, unknown>)["@type"] as string | undefined;
        if (nestedType) {
          children.push(renderMicrodataItem(v as Record<string, unknown>, nestedType));
        } else {
          children.push(
            <div key={childKey(key, childIndex - (items.length - 1))} itemProp={key}>
              {Object.entries(v as Record<string, unknown>).map(([k, val]) => (
                <span key={childKey(k, 0)} itemProp={k}>{String(val)}</span>
              ))}
            </div>
          );
        }
      } else {
        children.push(<meta key={childKey(key, childIndex++)} itemProp={key} content={String(v)} />);
      }
    }
  }

  return (
    <div key={key} itemScope itemType={`https://schema.org/${itemType}`} style={{display: "none"}} aria-hidden="true">
      {children}
    </div>
  );
}

function childKey(key: string, index: number) {
  return `${key}-${index}`;
}

function renderMicrodata(data: Record<string, unknown>) {
  const graph = data["@graph"] as Array<Record<string, unknown>> | undefined;
  if (graph) {
    return graph.map((item, i) => {
      const type = (item["@type"] as string) || "Thing";
      return renderMicrodataItem(item, type, `${type}-${i}`);
    });
  }

  const type = (data["@type"] as string);
  if (type) {
    return renderMicrodataItem(data, type);
  }

  return null;
}

export default function StructuredData({data}: StructuredDataProps) {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: json}} />
      {renderMicrodata(data)}
    </>
  );
}
