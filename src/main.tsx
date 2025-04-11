import { connect } from "datocms-plugin-sdk";
import { render } from "./utils/render";
import ConfigScreen from "./entrypoints/ConfigScreen";
import FieldExtensionConfigScreen from "./entrypoints/FieldExtensionConfigScreen";
import FieldExtension from "./entrypoints/FieldExtension";
import "datocms-react-ui/styles.css";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions() {
    return [
      {
        id: "foreignDataSelector",
        name: "Foreign Data Selector",
        type: "editor",
        fieldTypes: ["json"],
        configurable: true,
      },
    ];
  },
  renderFieldExtension(fieldExtensionId, ctx) {
    return render(
      <FieldExtension fieldExtensionId={fieldExtensionId} ctx={ctx} />,
    );
  },
  renderManualFieldExtensionConfigScreen(fieldExtensionId, ctx) {
    return render(
      <FieldExtensionConfigScreen
        fieldExtensionId={fieldExtensionId}
        ctx={ctx}
      />,
    );
  },
});
