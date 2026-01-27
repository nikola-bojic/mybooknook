/**
 * @typedef {import("@prismicio/client").Content.TwoColumnsSlice} TwoColumnsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TwoColumnsSlice>} TwoColumnsProps
 * @type {import("react").FC<TwoColumnsProps>}
 */
export function TwoColumns({ slice }) {
	return (
		<section
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
		>
			Placeholder component for two_columns (variation: {slice.variation})
			slices.
			<br />
			<strong>You can edit this slice directly in your code editor.</strong>
			{/**
       * 💡 Use the Prismic MCP server with your code editor
       * 📚 Docs: https://prismic.io/docs/ai#code-with-prismics-mcp-server
       */}
		</section>
	);
};