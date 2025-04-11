import { get } from "lodash";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import type { Parameters } from "../types/parameters";
import { useEffect, useState } from "react";
import getDataFromPath from "../utils/getDataFromPath";
import AsyncSelect from "react-select/async";
import parseString from "../utils/parseString";
import formatData from "../utils/formatData";
import SelectOption from "../components/SelectOption/SelectOption";
import type { SelectOption as SelectOptionType } from "../types/selectOption";
import SelectedList from "../components/SelectedList/SelectedList";
import SelectedListItem from "../components/SelectedListItem/SelectedListItem";

type Props = {
  fieldExtensionId: string;
  ctx: RenderFieldExtensionCtx;
};

export default function FieldExtension({ ctx }: Props) {
  const parameters = ctx.parameters as Parameters;
  const [selectValue, setSelectValue] = useState<SelectOptionType | null>(null);
  const [value, setValue] = useState(
    JSON.parse(get(ctx.formValues as Record<string, any>, ctx.fieldPath)) || [],
  );

  async function loadOptions(inputValue: string) {
    return new Promise<SelectOptionType[]>(async (resolve, reject) => {
      try {
        const url = new URL(
          parseString(parameters.searchUrl, { query: inputValue }),
        );
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        if (parameters.additionalHeaders) {
          Object.assign(headers, JSON.parse(parameters.additionalHeaders));
        }
        const response = await fetch(url, {
          method: "GET",
          headers,
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
            .filter((item: any) => !value.find((i) => i.id === item.data.id)),
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
    setValue(value.filter((i) => i.id !== item.id));
  }

  useEffect(() => {
    ctx.setFieldValue(ctx.fieldPath, JSON.stringify(value));
  }, [value]);

  return (
    <Canvas ctx={ctx}>
      <output>
        <SelectedList>
          {value.map((item: any, index: number) => (
            <SelectedListItem key={index} item={item} removeItem={removeItem}/>
          ))}
        </SelectedList>
      </output>

      <AsyncSelect
        loadOptions={loadOptions}
        formatOptionLabel={(option) => <SelectOption option={option} />}
        onChange={(item) => {
          selectItem(item as SelectOptionType);
          setSelectValue(null);
        }}
        value={selectValue}
      />
    </Canvas>
  );
}
