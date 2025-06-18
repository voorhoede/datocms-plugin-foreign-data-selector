import { connect } from "datocms-plugin-sdk";
import { render } from "./utils/render";
import ConfigScreen from "./entrypoints/ConfigScreen";
import FieldExtensionConfigScreen from "./entrypoints/FieldExtensionConfigScreen";
import FieldExtension from "./entrypoints/FieldExtension";
import "datocms-react-ui/styles.css";
import { get } from "lodash";

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
  async onBeforeItemUpsert(createOrUpdateItemPayload, ctx) {
    let invalidFields = false;
    const fieldsUsingPlugin = await ctx.loadFieldsUsingPlugin();

    fieldsUsingPlugin.forEach((field) => {
      if (
        createOrUpdateItemPayload.data.attributes &&
        field.attributes.api_key in createOrUpdateItemPayload.data.attributes
      ) {
        const value = JSON.parse(
          createOrUpdateItemPayload.data.attributes[
            field.attributes.api_key
          ] as string,
        );
        const parameters = field.attributes.appearance.parameters;
        if (parameters.min && value.length < parameters.min) {
          ctx.alert(`You need to select at least ${parameters.min} items`);
          if (!invalidFields) {
            invalidFields = true;
            ctx.scrollToField(field.id);
          }
        }
        if (parameters.max && value.length > parameters.max) {
          ctx.alert(`You need to select at most ${parameters.max} items`);
          if (!invalidFields) {
            invalidFields = true;
            ctx.scrollToField(field.id);
          }
        }
      }
    });

    return !invalidFields;
  },
});
