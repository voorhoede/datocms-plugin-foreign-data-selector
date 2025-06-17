import { get } from "lodash";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import type { Parameters } from "../types/parameters";
import { useEffect, useState } from "react";
import getDataFromPath from "../utils/getDataFromPath";
import parseString from "../utils/parseString";
import formatData from "../utils/formatData";
import SelectOption from "../components/SelectOption/SelectOption";
import type { SelectOption as SelectOptionType } from "../types/selectOption";
import SelectedList from "../components/SelectedList/SelectedList";
import SelectedListItem from "../components/SelectedListItem/SelectedListItem";
import InputSelect from "../components/InputSelect/InputSelect";
import { DragEndEvent } from "@dnd-kit/core";
import { ForeignDataItem } from "../types/ForeignDataItem";

type Props = {
  fieldExtensionId: string;
  ctx: RenderFieldExtensionCtx;
};

export default function FieldExtension({ ctx }: Props) {
  const parameters = ctx.parameters as Parameters;
  const [selectValue, setSelectValue] = useState<SelectOptionType | null>(null);
  const [value, setValue] = useState<ForeignDataItem[]>(
    JSON.parse(get(ctx.formValues, ctx.fieldPath) as string) || [],
  );

  async function loadOptions(inputValue: string) {
    return new Promise<SelectOptionType[]>(async (resolve, reject) => {
      try {
        const url = new URL(parseString(parameters.searchUrl, { query: inputValue }));
        const proxy = new URL('https://cors-proxy.datocms.com');
        proxy.searchParams.set('url', url.href);

        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        if (parameters.additionalHeaders) {
          Object.assign(headers, JSON.parse(parameters.additionalHeaders));
        }

        const response = await fetch(proxy, {
          method: "GET",
          headers
        });
        const data = await response.json();
        const dataFromPath = getDataFromPath(data, parameters.path);
        const formattedData = formatData(dataFromPath, parameters);
        resolve(
          formattedData
            .map((item: any) => ({
              value: item.id,
              label: item.title,
              data: { ...item },
            }))
            .filter((item: any) => !value.find((i: { id: string }) => i.id === item.data.id)),
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  function selectItem(item: SelectOptionType) {
    setValue([...value, item.data]);
  }

  function removeItem(item: { id: string; title: string }) {
    console.log(item);
    setValue(value.filter((i: { id: string }) => i.id !== item.id));
  }

  useEffect(() => {
    /* fieldValue contains all sorts of characters like \n which will never be matched, so we have to parse and stringify to get rid of them */
    const oldFieldValue = JSON.stringify(JSON.parse(get(ctx.formValues, ctx.fieldPath) as string));
    const newFieldValue = JSON.stringify(value);

    if (oldFieldValue !== newFieldValue) {
      ctx.setFieldValue(ctx.fieldPath, newFieldValue);
    }
  }, [value]);

  return (
    <Canvas ctx={ctx}>
      <InputSelect
        loadOptions={loadOptions}
        formatOptionLabel={(option) => <SelectOption option={option} />}
        onChange={(item) => {
          selectItem(item as SelectOptionType);
          setSelectValue(null);
        }}
        value={selectValue}
      />

      <output>
        <SelectedList items={value} handleDragEnd={setValue}>
          {value.map((item) => (
            <SelectedListItem key={item.id} id={item.id} item={item} removeItem={removeItem}/>
          ))}
        </SelectedList>
      </output>
    </Canvas>
  );
}
