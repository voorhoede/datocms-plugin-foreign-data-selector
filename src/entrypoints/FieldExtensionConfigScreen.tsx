import type { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import {
  Canvas,
  FieldGroup,
  FieldHint,
  Form,
  SwitchField,
  TextareaField,
  TextField
} from "datocms-react-ui";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
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
  const [additionalHeaders, setAdditionalHeaders] = useState<string>(parameters.additionalHeaders);
  const [useCORSProxy, setUseCORSProxy] = useState<boolean>(parameters.useCORSProxy);
  const [min, setMin] = useState<string | undefined>(parameters.min);
  const [max, setMax] = useState<string | undefined>(parameters.max);
  const [path, setPath] = useState<string>(parameters.path ?? "data[0].products");
  const [idMap, setIdMap] = useState<string>(parameters.idMap ?? "id");
  const [titleMap, setTitleMap] = useState<string>(parameters.titleMap ?? "title");
  const [descriptionMap, setDescriptionMap] = useState<string | undefined>(parameters.descriptionMap);
  const [imageUrlMap, setImageUrlMap] = useState<string | undefined>(parameters.imageUrlMap);

  const preview = useMemo(
    () =>
      JSON.stringify(
        createPreviewObject(path, idMap, titleMap, descriptionMap, imageUrlMap),
        null,
        2,
      ),
    [path, idMap, titleMap, descriptionMap, imageUrlMap],
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setParameters({
        searchUrl,
        additionalHeaders,
        useCORSProxy,
        min,
        max,
        path,
        idMap,
        titleMap,
        descriptionMap,
        imageUrlMap,
      });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [
    searchUrl,
    additionalHeaders,
    useCORSProxy,
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
        <TextareaField
          id="additionalHeaders"
          name="additionalHeaders"
          label="Additional Headers (JSON format)"
          hint='For example: {"Authorization": "Bearer 123", "X-API-Key": "abc"}'
          value={additionalHeaders}
          onChange={setAdditionalHeaders}
          textareaInputProps={{
            monospaced: true,
            rows: 3,
          }}
        />
        <SwitchField
          name="useCORSProxy"
          id="useCORSProxy"
          label="Use CORS Proxy"
          hint="Enable if the API doesn't allow direct browser requests (CORS errors)"
          value={useCORSProxy}
          onChange={setUseCORSProxy}
        />

        <h3>Response Mapping</h3>

        <TextField
          id="path"
          name="path"
          label="Path"
          value={path}
          onChange={setPath}
          hint={
            <FieldHint>
              Path to the array of items in the API response. Uses JSON Path notation.{" "}
              <a href="https://jsonpath.com/" target="_blank">
                Learn more
              </a>
            </FieldHint>
          }
          required
        />
        <TextField
          id="idMap"
          name="idMap"
          label="ID"
          value={idMap}
          onChange={setIdMap}
          hint="Key in the response object that maps to the item's unique identifier"
          required
        />
        <TextField
          id="titleMap"
          name="titleMap"
          label="Title"
          value={titleMap}
          onChange={setTitleMap}
          hint="Key in the response object used as the display title"
          required
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          value={descriptionMap}
          onChange={setDescriptionMap}
          hint="Key in the response object used as the item description"
        />
        <TextField
          id="imageUrl"
          name="imageUrl"
          label="Image URL"
          value={imageUrlMap}
          onChange={setImageUrlMap}
          hint="Key in the response object that contains a preview image URL"
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

        <h3>Validation</h3>

        <FieldGroup>
          <TextField
            id="min"
            name="min"
            label="Minimum selections"
            value={min}
            onChange={setMin}
            hint="Minimum number of items the editor must select"
            textInputProps={{ type: "number", min: "0" }}
          />
          <TextField
            id="max"
            name="max"
            label="Maximum selections"
            value={max}
            onChange={setMax}
            hint="Maximum number of items the editor can select"
            textInputProps={{ type: "number", min: "0" }}
          />
        </FieldGroup>
      </Form>
    </Canvas>
  );
}
