import { useStorage } from "@plasmohq/storage/hook";
import LabelRadioGroup from "~components/custom/label-radio-group";
import LabelSwitch from "~components/custom/label-switch";
import { H4, InlineCode, P } from "~components/custom/typography";
import { ClickBehavior, Origins, StorageKey } from "~constants";

export type FormSchema = {
  clickBehavior: ClickBehavior;
  showAllPosts: boolean;
  showToolbar: boolean;
  zoomCard: boolean;
  keyboardNavigation: boolean;
};

export const defaultFormValues = {
  clickBehavior: ClickBehavior.Default,
  showAllPosts: false,
  showToolbar: true,
  zoomCard: false,
  keyboardNavigation: false,
};

type Props = { origin: string };

export default function Settings({ origin }: Props) {
  const [formValues, setFormValues] = useStorage<FormSchema>(
    StorageKey.Settings,
    defaultFormValues,
  );

  const {
    clickBehavior,
    showAllPosts,
    showToolbar,
    zoomCard,
    keyboardNavigation,
  } = formValues;
  return (
    <div className="space-y-4">
      <H4>Settings</H4>
      <LabelRadioGroup
        value={clickBehavior}
        onChange={(clickBehavior) => {
          setFormValues({
            ...formValues,
            clickBehavior,
          });
        }}
        label="Click card behavior"
        options={Object.entries(ClickBehavior).map(([label, value]) => ({
          label,
          value,
        }))}
      />
      {origin === Origins.Yandere && (
        <LabelSwitch
          value={showAllPosts}
          onChange={(showAllPosts) => {
            setFormValues({
              ...formValues,
              showAllPosts,
            });
          }}
          label="Show all posts"
        />
      )}
      <LabelSwitch
        value={showToolbar}
        onChange={(showToolbar) => {
          setFormValues({
            ...formValues,
            showToolbar,
          });
        }}
        label="Show toolbar"
      />
      <LabelSwitch
        value={zoomCard}
        onChange={(zoomCard) => {
          setFormValues({
            ...formValues,
            zoomCard,
          });
        }}
        label="Zoom card"
        disabled={keyboardNavigation}
        help={
          keyboardNavigation ? (
            <P className="w-80">
              If keyboard navigation is enabled, the zoom card will be disabled
              because of a function conflict.
            </P>
          ) : null
        }
      />
      <LabelSwitch
        value={keyboardNavigation}
        onChange={(keyboardNavigation) => {
          setFormValues({
            ...formValues,
            keyboardNavigation,
            zoomCard: keyboardNavigation ? false : zoomCard,
          });
        }}
        label="Keyboard navigation"
        help={
          keyboardNavigation ? (
            <P className="w-80">
              Use <InlineCode>Arrow Right/Left</InlineCode> to focus on the
              next/previous card, <InlineCode>Arrow Up</InlineCode> to
              zoom/restore the card, and <InlineCode>Arrow Down</InlineCode> to
              trigger card click behavior.
            </P>
          ) : null
        }
      />
    </div>
  );
}
