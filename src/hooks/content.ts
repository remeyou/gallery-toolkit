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
      const originalCSS = $el.css([
        "position",
        "z-index",
        "transform",
        "box-shadow",
      ]);
      $el
        .on("mouseenter", () => scaleLarge(el, true))
        .on("mouseleave", () => scaleRestore($el, originalCSS));
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
        if (cursor === undefined) {
          cursor = 0;
          boxShadow = modifyBoxShadow($(els[cursor]));
          return;
        }
        const $el = $(els[cursor]);
        if (originalCSS) {
          scaleRestore($el, originalCSS);
          originalCSS = null;
        }
        $el.css({
          boxShadow,
        });
        if (e.key === "ArrowRight") {
          if (cursor === els.length - 1) {
            cursor = -1;
          }
          ++cursor;
        }
        if (e.key === "ArrowLeft") {
          if (cursor === 0) {
            cursor = els.length;
          }
          --cursor;
        }
        const el = els[cursor];
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
        boxShadow = modifyBoxShadow($(els[cursor]));
        return;
      }

      if (cursor === undefined) {
        return;
      }

      if ("ArrowUp" === e.key) {
        if (originalCSS === null) {
          originalCSS = $(els[cursor]).css([
            "position",
            "z-index",
            "transform",
            "box-shadow",
          ]);
          scaleLarge(els[cursor], false);
        } else {
          scaleRestore($(els[cursor]), originalCSS);
          originalCSS = null;
        }
      } else if ("ArrowDown" == e.key) {
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
