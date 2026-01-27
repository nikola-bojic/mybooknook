import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import { linkResolver } from "@/app/lib/linkResolver";

export function RichText({ field }) {

  return (
    <PrismicRichText field={field} linkResolver={linkResolver} />
  );
}
