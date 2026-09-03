import { useStorage } from "@plasmohq/storage/hook";
import $ from "jquery";
import { useEffect } from "react";
import { ClickBehavior, Origins, RequestPath, StorageKey } from "~constants";
import {
  formatElement,
  modifyBoxShadow,
  scaleLarge,
  scaleRestore,
  sendMessage,
} from "~lib/utils";
import { defaultFormValues, type FormSchema } from "~pages/settings";
import type { FormattedElement } from "~typings";

const collect = (elementSelector: string): Promise<JQuery<HTMLElement>> => {
  const els = $(elementSelector);
  if (!els?.length) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(collect(elementSelector));
      }, 2000);
    });
  } else {
    return Promise.resolve(els);
  }
};

const onBtnClick = (
  path: RequestPath,
  body: FormattedElement[],
  e: JQuery.ClickEvent,
) => {
  e.preventDefault();
  e.stopPropagation();
  sendMessage({
    path,
    body,
  });
};

const modify = (settings: FormSchema, els: JQuery) => {
  const list: FormattedElement[][] = [];

  els.each((i, el) => {
    const $el = $(el);
    const elInfo = formatElement(el);
    list.push(elInfo);
    $el.off("mouseenter").off("mouseleave");

    if (settings.showAllPosts && $el.is(".javascript-hide")) {
      $el.removeClass("javascript-hide");
    }

    if (settings.showToolbar) {
      const btnBaseStyle = {
        position: "absolute",
        top: "8px",
        right: "8px",
        padding: "4px 6px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        opacity: 0,
        cursor: "pointer",
      };
      const $inspectBtn = $("<div>")
        .css(btnBaseStyle)
        .text("🔍")
        .on("click", onBtnClick.bind(null, RequestPath.Inspect, elInfo));
      const $downloadBtn = $("<div>")
        .css({ ...btnBaseStyle, right: `${8 + 38 * 1}px` })
        .text("💾")
        .on("click", onBtnClick.bind(null, RequestPath.Download, elInfo));
      $el
        .on("mouseenter", () => {
          $inspectBtn.css({ opacity: 1 });
          $downloadBtn.css({ opacity: 1 });
        })
        .on("mouseleave", () => {
          $inspectBtn.css({ opacity: 0 });
          $downloadBtn.css({ opacity: 0 });
        })
        .append([$inspectBtn, $downloadBtn]);
    }

    if (settings.zoomCard) {
      let originalCSS: JQuery.PlainObject<string> | null = null;
      $el.on("contextmenu", (e) => {
        e.preventDefault();
        if (originalCSS === null) {
          originalCSS = $el.css([
            "position",
            "z-index",
            "transform",
            "box-shadow",
          ]);
          scaleLarge($el, false);
        } else {
          scaleRestore($el, originalCSS);
          originalCSS = null;
        }
      });
    }

    $el.off("click");
    switch (settings.clickBehavior) {
      case ClickBehavior.Inspect:
        $el.on("click", onBtnClick.bind(null, RequestPath.Inspect, elInfo));
        break;
      case ClickBehavior.Download:
        $el.on("click", onBtnClick.bind(null, RequestPath.Download, elInfo));
        break;
    }
  });

  $(document).off("keydown");
  if (settings.keyboardNavigation) {
    $(document).on("keydown", (e) => {
      if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
      }
    });

    let cursor: number;
    let boxShadow: string;
    let originalCSS: JQuery.PlainObject<string> | null = null;
    $(document).on("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        const $el = $(els[cursor]);
        if (cursor === undefined) {
          cursor = 0;
          boxShadow = modifyBoxShadow($el);
          return;
        }
        if (originalCSS) {
          scaleRestore($el, originalCSS);
          originalCSS = null;
        }
        $el.css({
          boxShadow,
        });
        if (["ArrowRight"].includes(e.key)) {
          if (cursor === els.length - 1) {
            cursor = -1;
          }
          ++cursor;
        }
        if (["ArrowLeft"].includes(e.key)) {
          if (cursor === 0) {
            cursor = els.length;
          }
          --cursor;
        }
        els[cursor].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
        boxShadow = modifyBoxShadow($el);
        return;
      }

      if (cursor === undefined) {
        return;
      }

      if (["ArrowUp"].includes(e.key)) {
        const $el = $(els[cursor]);
        if (originalCSS === null) {
          originalCSS = $el.css([
            "position",
            "z-index",
            "transform",
            "box-shadow",
          ]);
          scaleLarge($el, false);
        } else {
          scaleRestore($el, originalCSS);
          originalCSS = null;
        }
      } else if (["ArrowDown"].includes(e.key)) {
        $(els[cursor]).trigger("click");
      }
    });
  }

  sendMessage({
    path: RequestPath.List,
    body: list,
  });
};

export const useContentScript = () => {
  const [formValues] = useStorage<FormSchema>(
    StorageKey.Settings,
    defaultFormValues,
  );

  useEffect(() => {
    switch (location.origin) {
      case Origins.Localhost:
        collect(".ant-card").then(modify.bind(null, formValues));
        break;
      case Origins.Yandere:
        collect("#post-list-posts > li").then(modify.bind(null, formValues));
        break;
    }
  }, [formValues]);
};
