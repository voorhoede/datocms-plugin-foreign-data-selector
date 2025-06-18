import type { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import {
  Canvas,
  FieldGroup,
  FieldHint,
  Form,
  TextareaField,
  TextField
} from "datocms-react-ui";
import { useEffect, useState } from "react";
import createPreviewObject from "../utils/createPreviewObject";
import type { Parameters } from "../types/parameters";

type Props = {
  fieldExtensionId: string;
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const parameters = ctx.parameters as Parameters;
  const setParameters = ctx.setParameters;
  const [searchUrl, setSearchUrl] = useState<string>(parameters.searchUrl);
  const [additionalHeaders, setAdditionalHeaders] = useState<string>(
    parameters.additionalHeaders,
  );
  const [min, setMin] = useState<string | undefined>(parameters.min);
  const [max, setMax] = useState<string | undefined>(parameters.max);
  const [path, setPath] = useState<string>(
    parameters.path ?? "data[0].products",
  );
  const [idMap, setIdMap] = useState<string>(parameters.idMap ?? "id");
  const [titleMap, setTitleMap] = useState<string>(
    parameters.titleMap ?? "title",
  );
  const [descriptionMap, setDescriptionMap] = useState<string | undefined>(
    parameters.descriptionMap,
  );
  const [imageUrlMap, setImageUrlMap] = useState<string | undefined>(
    parameters.imageUrlMap,
  );
  const [preview, setPreview] = useState<string>();

  function renderPreview() {
    const previewObj = createPreviewObject(
      path,
      idMap,
      titleMap,
      descriptionMap,
      imageUrlMap,
    );
    setPreview(JSON.stringify(previewObj, null, 2));
  }

  useEffect(() => {
    renderPreview();

    const newParameters = {
      ...parameters,
      searchUrl,
      additionalHeaders,
      min,
      max,
      path,
      idMap,
      titleMap,
      descriptionMap,
      imageUrlMap,
    };
    setParameters(newParameters);
  }, [
    searchUrl,
    additionalHeaders,
    min,
    max,
    path,
    idMap,
    titleMap,
    descriptionMap,
    imageUrlMap,
  ]);

  return (
    <Canvas ctx={ctx}>
      <Form>
        <h3>Search Configuration</h3>

        <TextField
          id="searchUrl"
          name="searchUrl"
          label="Search URL"
          value={searchUrl}
          onChange={setSearchUrl}
          hint="URL should contain a { query } placeholder."
          required
        />
        <TextField
          id="additionalHeaders"
          name="additionalHeaders"
          label="Additional Headers (JSON format)"
          hint='For example: {"Authorization":"Bearer 123","X-API-Key":"abc"}'
          value={additionalHeaders}
          onChange={setAdditionalHeaders}
        />

        <FieldGroup>
          <TextField
            id="min"
            name="min"
            label="Min"
            value={min}
            onChange={setMin}
          />
          <TextField
            id="max"
            name="max"
            label="Max"
            value={max}
            onChange={setMax}
          />
        </FieldGroup>

        <h3>Response Mapping</h3>

        <TextField
          id="path"
          name="path"
          label="Path"
          value={path}
          onChange={setPath}
          hint={<FieldHint>Use JSON Path notation. <a href="https://jsonpath.com/" target="_blank">Learn more</a></FieldHint>}
          required
        />
        <TextField
          id="idMap"
          name="idMap"
          label="ID"
          value={idMap}
          onChange={setIdMap}
          required
        />
        <TextField
          id="titleMap"
          name="titleMap"
          label="Title"
          value={titleMap}
          onChange={setTitleMap}
          required
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          value={descriptionMap}
          onChange={setDescriptionMap}
        />
        <TextField
          id="imageUrl"
          name="imageUrl"
          label="Image URL"
          value={imageUrlMap}
          onChange={setImageUrlMap}
        />
        <TextareaField
          id="responsePreview"
          name="responsePreview"
          label="Response Preview"
          value={preview}
          onChange={() => undefined}
          textareaInputProps={{
            monospaced: true,
            readOnly: true,
            rows: 10,
          }}
        />
      </Form>
    </Canvas>
  );
}
