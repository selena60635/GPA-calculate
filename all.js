const tl = gsap.timeline();
tl.fromTo(
  ".animation-img",
  1,
  { height: "0" },
  { height: "80vh", ease: "power1.Out" }
)
  .fromTo(
    ".animation-img",
    1,
    { width: "80%" },
    { width: "100%", ease: "power1.Out" }
  )
  .fromTo(
    ".animation-slider",
    1.2,
    { x: "-100%" },
    { x: "0%", ease: "power1.Out" },
    "-=1.2"
  )
  .fromTo(".animation", 1, { opacity: "1" }, { opacity: "0" });

//解決動畫遮擋畫面無法點擊的問題
let animation = document.querySelector(".animation");
setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 3000);

//防止form按下Enter键會提交表單
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });
});

//改變選項時改變背景色
let selectGrade = document.querySelectorAll(".select-grade");
selectGrade.forEach((opt) => {
  opt.addEventListener("change", (e) => {
    gpa();
    changeColor(e.target);
  });
});
function changeColor(target) {
  if (target.value === "A" || target.value === "A-") {
    target.style.background = " rgb(15, 168, 81)";
    target.style.color = "white";
  } else if (
    target.value === "B" ||
    target.value === "B-" ||
    target.value === "B+"
  ) {
    target.style.background = " rgb(245, 198, 26)";
    target.style.color = "white";
  } else if (
    target.value === "C" ||
    target.value === "C-" ||
    target.value === "C+"
  ) {
    target.style.background = "rgb(75, 217, 217)";
    target.style.color = "white";
  } else if (
    target.value === "D" ||
    target.value === "D-" ||
    target.value === "D+"
  ) {
    target.style.background = " rgb(226, 84, 84)";
    target.style.color = "white";
  } else {
    target.style.background = "white";
    target.style.color = "black";
  }
}

//轉換等級分類為點數
function convertGrad(value) {
  switch (value) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return "";
  }
}

//計算gpa結果
function gpa() {
  let creditSum = 0; //分母
  let gradesum = 0;
  //學分加一起當分母
  //學分*點數相加當分子
  let classCredit = document.querySelectorAll(".class-credit");
  let selectGrade = document.querySelectorAll(".select-grade");
  for (let i = 0; i < classCredit.length; i++) {
    if (
      convertGrad(selectGrade[i].value) !== "" &&
      !isNaN(classCredit[i].valueAsNumber)
    ) {
      creditSum += classCredit[i].valueAsNumber;
    }
  }
  for (let i = 0; i < selectGrade.length; i++) {
    if (
      !isNaN(classCredit[i].valueAsNumber) &&
      classCredit[i].valueAsNumber !== ""
    ) {
      gradesum +=
        classCredit[i].valueAsNumber * convertGrad(selectGrade[i].value);
    }
  }
  let result = gradesum / creditSum;
  if (!isNaN(result)) {
    document.querySelector("#gpa-result").innerText = result.toFixed(2);
  }
  //輸入表單計算好答案並更新 > 刪除表單答案變成NaN > 分數更新成0(如果沒有這行分數就不會更新)
  else document.querySelector("#gpa-result").innerText = (0).toFixed(2);
}
//改變學分選項時執行gpa()
let classCredit = document.querySelectorAll(".class-credit");
classCredit.forEach((n) => {
  n.addEventListener("change", () => {
    gpa();
  });
});

// 在form容器內添加一個新form
function plusForm(allforms) {
  let newForm = document.createElement("form");
  newForm.classList.add("mb-2", "d-f", "jcc", "gap-0", "aic", "at-scaleUp");
  //靜態的關係，新的input3也要再掛上事件監聽器，否則不會有作用
  newForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  let newInput1 = document.createElement("input");
  newInput1.classList.add("p-0", "w-20");
  newInput1.setAttribute("type", "text");
  newInput1.setAttribute("list", "opt");
  newInput1.setAttribute("placeholder", "class category");

  let newInput2 = document.createElement("input");
  newInput2.classList.add("p-0", "w-20");
  newInput2.setAttribute("type", "text");
  newInput2.setAttribute("placeholder", "class number");

  let newInput3 = document.createElement("input");
  newInput3.classList.add("p-0", "w-10", "class-credit");
  newInput3.setAttribute("type", "number");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  newInput3.setAttribute("placeholder", "credits");
  //靜態的關係，新的input3也要再掛上事件監聽器，否則不會有作用，不用重抓Input是因為寫在gpa()內了，每次換都會執行，也就都會重抓了
  newInput3.addEventListener("change", () => {
    gpa();
  });

  //做一個新的垃圾桶按鈕
  let newBtn = document.createElement("button");
  newBtn.classList.add("bg-none", "text-light", "border-none");
  newBtn.setAttribute("type", "button");
  let icon = document.createElement("i");
  icon.classList.add("fas", "fa-trash", "fs-2");
  newBtn.appendChild(icon);
  //新的按鈕也要掛上點擊清除事件
  newBtn.addEventListener("click", (e) => {
    const form = newBtn.parentElement;
    form.classList.remove("at-scaleUp");
    form.classList.add("at-scaleDown");
    form.addEventListener("animationend", () => {
      form.remove();
      gpa();
    });
  });
  //做一個新的等級選擇器
  let newSelect = document.createElement("select");
  newSelect.classList.add("radius", "select-grade");
  //在新的select裡加入所有選項對應的option元素
  let newValue = [
    "",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
  ];
  for (let i = 0; i < newValue.length; i++) {
    let newOpt = document.createElement("option");
    newOpt.setAttribute("value", newValue[i]);
    newOpt.innerText = newValue[i];
    newSelect.appendChild(newOpt);
  }
  //靜態的關係，新的select也要再掛上事件監聽器，否則不會有作用，不用重抓select是因為寫在gpa()內了，每次換都會執行，也就都會重抓了
  newSelect.addEventListener("change", (e) => {
    gpa();
    changeColor(e.target);
  });

  //在新的form內加入創建好的新元素，完成一個新form
  newForm.appendChild(newInput1);
  newForm.appendChild(newInput2);
  newForm.appendChild(newInput3);
  newForm.appendChild(newSelect);
  newForm.appendChild(newBtn);
  //在form容器內加入新form
  allforms.appendChild(newForm);
  //新增表單完要重抓清除按鈕，不然按鈕數量不會更新
  clearBtns = document.querySelectorAll("form button");
}
// 表單容器
let forms = document.querySelector("form").parentElement;
//點+新增form
let btnPlus = document.querySelector(".js-plus");
btnPlus.addEventListener("click", () => {
  plusForm(forms);
});

//誰被點了就刪他爸
let clearBtns = document.querySelectorAll("form button");
clearBtns.forEach((clearBtn) => {
  clearBtn.addEventListener("click", (e) => {
    const form = clearBtn.parentElement;
    form.classList.remove("at-scaleUp");
    form.classList.add("at-scaleDown");
    form.addEventListener("animationend", () => {
      form.remove();
      gpa();
    });
  });
});

//排序按鈕
let btnSorts = document.querySelectorAll(".btn-sort");
btnSorts[0].addEventListener("click", () => handleSorting("ascending"));
btnSorts[1].addEventListener("click", () => handleSorting("descending"));
//排序
function handleSorting(direction) {
  let forms = document.querySelectorAll("form");
  //創建表單物件填入原本的資訊
  let objectArr = [];
  for (let i = 0; i < forms.length; i++) {
    let classCategory = forms[i].children[0].value;
    let classNumber = forms[i].children[1].value;
    let classCredit = forms[i].children[2].value;
    let classGrade = forms[i].children[3].value;
    let formObject = {
      classCategory,
      classNumber,
      classCredit,
      classGrade,
    };
    objectArr.push(formObject);
  }
  //第1種寫法；空值與要排序值拆開來，將要排序值排好後再將兩個陣列合併
  let emptyGradeArr = [];
  let nonEmptyArr = [];
  for (let i = 0; i < objectArr.length; i++) {
    if (objectArr[i].classGrade === "") {
      emptyGradeArr.push(objectArr[i]);
    } else {
      nonEmptyArr.push(objectArr[i]);
    }
  }
  // //小排到大
  for (let i = 0; i < nonEmptyArr.length - 1; i++) {
    for (let j = i + 1; j < nonEmptyArr.length; j++) {
      if (
        convertGrad(nonEmptyArr[i].classGrade) >
        convertGrad(nonEmptyArr[j].classGrade)
      ) {
        [nonEmptyArr[i], nonEmptyArr[j]] = [nonEmptyArr[j], nonEmptyArr[i]];
      }
    }
  }
  // //取得排序好的新表單物件
  let sortedObjs = [...nonEmptyArr, ...emptyGradeArr];
  // //判斷升序或降序
  if (direction === "ascending") {
    sortedObjs = [...nonEmptyArr.reverse(), ...emptyGradeArr];
  } else if (direction === "descending") {
    sortedObjs = [...nonEmptyArr, ...emptyGradeArr];
  }
  // //將sortedObjs的物件屬性，也就是表單內容更新回頁面
  let formsWrap = document.querySelector(".js-forms");
  formsWrap.innerHTML = "";
  for (let i = 0; i < sortedObjs.length; i++) {
    formsWrap.innerHTML += `<form class="mb-2 d-f jcc gap-0 aic">
    <input
      class="p-0 w-20"
      type="text"
      placeholder="class category"
      list="opt"
      value="${sortedObjs[i].classCategory}"
    />
    <input class="p-0 w-20" type="text" placeholder="class number" value="${sortedObjs[i].classNumber}" />
    <input
      class="p-0 w-10 class-credit"
      type="number"
      placeholder="credits"
      min="0"
      max="6"
      value="${sortedObjs[i].classCredit}"
    />
    <select class="radius select-grade" name="select">
      <option value=""></option>
      <option value="A">A</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B">B</option>
      <option value="B-">B-</option>
      <option value="C+">C+</option>
      <option value="C">C</option>
      <option value="C-">C-</option>
      <option value="D+">D+</option>
      <option value="D">D</option>
      <option value="D-">D-</option>
      <option value="F">F</option>
    </select>
    <button class="bg-none text-light border-none" type="button">
      <i class="fas fa-trash fs-2"></i>
    </button>
  </form>`;
  }
  //要重抓，不然拿到的會是已經清空後的值
  selectGrade = document.querySelectorAll(".select-grade");
  for (let i = 0; i < selectGrade.length; i++) {
    selectGrade[i].value = sortedObjs[i].classGrade;
    changeColor(selectGrade[i]);
    selectGrade[i].addEventListener("change", (e) => {
      changeColor(e.target);
      gpa();
    });
  }
  //學分重掛監聽器
  classCredit = document.querySelectorAll(".class-credit");
  classCredit.forEach((n) => {
    n.addEventListener("change", () => {
      gpa();
    });
  });
  //垃圾桶重掛監聽器
  clearBtns = document.querySelectorAll("form button");
  clearBtns.forEach((clearBtn) => {
    clearBtn.addEventListener("click", (e) => {
      const form = clearBtn.parentElement;
      form.classList.remove("at-scaleUp");
      form.classList.add("at-scaleDown");
      form.addEventListener("animationend", () => {
        form.remove();
        gpa();
      });
    });
  });
}
