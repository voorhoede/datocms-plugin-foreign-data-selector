import { debounce, get } from "lodash";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import type { Parameters } from "../types/parameters";
import { useCallback, useEffect, useState, useRef } from "react";
import getDataFromPath from "../utils/getDataFromPath";
import parseString from "../utils/parseString";
import formatData from "../utils/formatData";
import type { SelectOption as SelectOptionType } from "../types/selectOption";
import SelectedList from "../components/SelectedList/SelectedList";
import SelectedListItem from "../components/SelectedListItem/SelectedListItem";
import InputSelect from "../components/InputSelect/InputSelect";
import { ForeignDataItem } from "../types/ForeignDataItem";

type Props = {
  fieldExtensionId: string;
  ctx: RenderFieldExtensionCtx;
};

export default function FieldExtension({ ctx }: Props) {
  const {
    setHeight,
    startAutoResizer,
    stopAutoResizer,
    parameters: rawParameters,
    fieldPath,
    formValues,
  } = ctx;

  const parameters = rawParameters as Parameters;
  const [selectValue, setSelectValue] = useState<SelectOptionType | null>(null);
  const [value, setValue] = useState<ForeignDataItem[]>(
    JSON.parse(get(formValues, fieldPath) as string) || [],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = useCallback(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.getBoundingClientRect().height;

      stopAutoResizer();

      setHeight(Math.max(currentHeight, 360) + 20);
    }
  }, [stopAutoResizer, setHeight]);

  const handleMenuClose = useCallback(() => {
    startAutoResizer();
  }, [startAutoResizer]);

  const fetchOptions = async (
    inputValue: string,
  ): Promise<SelectOptionType[]> => {
    const url = new URL(
      parseString(parameters.searchUrl, { query: inputValue }),
    );
    const proxy = new URL("https://cors-proxy.datocms.com");
    proxy.searchParams.set("url", url.href);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (parameters.additionalHeaders) {
      Object.assign(headers, JSON.parse(parameters.additionalHeaders));
    }

    const response = await fetch(parameters.useCORSProxy ? proxy : url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    const dataFromPath = getDataFromPath(data, parameters.path);
    const formattedData = formatData(dataFromPath, parameters);

    return formattedData
      .map((item: any) => ({
        value: item.id,
        label: item.title,
        data: { ...item },
      }))
      .filter(
        (item: any) =>
          !value.find((i: { id: string }) => i.id === item.data.id),
      );
  };

  const loadOptions = useCallback(
    debounce(
      (inputValue: string, callback: (options: SelectOptionType[]) => void) => {
        fetchOptions(inputValue)
          .then((options) => callback(options))
          .catch((error) => {
            console.error(error);
            callback([]);
          });
      },
      300,
    ),
    [parameters, value],
  );

  function selectItem(item: SelectOptionType) {
    if (parameters.max && value.length >= Number(parameters.max)) return;
    setValue([...value, item.data]);
  }

  function removeItem(item: { id: string; title: string }) {
    setValue(value.filter((i: { id: string }) => i.id !== item.id));
  }

  useEffect(() => {
    const oldFieldValue = JSON.stringify(
      JSON.parse(get(formValues, fieldPath) as string),
    );
    const newFieldValue = JSON.stringify(value);

    if (oldFieldValue !== newFieldValue) {
      ctx.setFieldValue(fieldPath, newFieldValue);
    }
  }, [value, fieldPath, formValues, ctx]);

  return (
    <Canvas ctx={ctx}>
      <div ref={containerRef}>
        <InputSelect
          itemLength={value.length}
          min={parameters.min ? Number(parameters.min) : undefined}
          max={parameters.max ? Number(parameters.max) : undefined}
          loadOptions={loadOptions}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onChange={(item) => {
            selectItem(item as SelectOptionType);
            setSelectValue(null);
            handleMenuClose();
          }}
          value={selectValue}
        />

        <output>
          <SelectedList items={value} handleDragEnd={setValue}>
            {value.map((item) => (
              <SelectedListItem
                key={item.id}
                id={item.id}
                item={item}
                removeItem={removeItem}
              />
            ))}
          </SelectedList>
        </output>
      </div>
    </Canvas>
  );
}
