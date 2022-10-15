//Токен бота в телеграмме (нужно захешить, закодировать итд)
const token = "5738529884:AAH5oLyeZ8ieuWFrj5DtRDXzO5i5tafFahg";
//Задать стартовую дату и инициализировать календарь
let startDate = new Date();
new AirDatepicker("#airdatepicker", {
  //Окрасить клетки календаря в разные цвета согласно ценовому периоду (пока не понял, как выбрать конкретный месяц + день, только месяц целиком)
  onRenderCell({ date, cellType }) {
    if (cellType === "day" && date.getMonth() === 5) {
      return {
        classes: "-emoji-cell-",
      };
    }
  },

  //Действие при выборе даты
  onSelect({ date }) {
    //Если не заданы даты вывести "ЦЕНА: ХХХ"
    if (typeof date[0] == "undefined") {
      document.getElementById("price").innerHTML = `ЦЕНА: XXX`;
    }

    //Если заданы обе даты
    if (typeof date[1] !== "undefined") {
      sum = 0;
      var dateString = date[0];
      var dateObj = new Date(dateString);
      var momentObj = moment(dateObj);
      momentObj = momentObj.hour(0);

      var dateStringT = date[1];
      var dateObjT = new Date(dateStringT);
      var momentObjT = moment(dateObjT);
      momentObjT = momentObjT.hour(0);
      var m = moment();
      calcPrice(momentObjT);

      while (momentObj.isSame(momentObjT) == false) {
        m = momentObjT.subtract(1, "d");
        calcPrice(m);
      }
      console.log(sum);
      document.getElementById("price").innerHTML = `ЦЕНА: ${sum} РУБЛЕЙ`;
    } else if (typeof date[0] !== "undefined") {
      sum = 0;
      var dateString = date[0];
      var dateObj = new Date(dateString);
      var momentObj = moment(dateObj);
      momentObj = momentObj.hour(0);

      calcPrice(momentObj);
      console.log(sum);
      document.getElementById("price").innerHTML = `ЦЕНА: ${sum} РУБЛЕЙ`;
    }
  },

  //Диапазон дат и вид разделителя
  range: true,
  multipleDatesSeparator: " - ",

  //Кнопка "Забронировать"
  buttons: [
    "clear",
    "today",
    {
      content(dp) {
        return "Забронировать";
      },
      onClick(dp) {
        console.log("button_pressed");
        airdatepicker.value.length == 0
          ? alert("Вы не указали даты")
          : sendMessage(sum, token);
      },
    },
  ],
});

//Считает цену за данный период (даты указываются включительно)
function calcPrice(m) {
  if (m.isBetween("2022-05-20", "2022-06-10", undefined, "[]")) {
    sum += 900;
  } else if (
    m.isBetween("2022-06-11", "2022-06-30", undefined, "[]") ||
    m.isBetween("2022-08-26", "2022-09-10", undefined, "[]")
  ) {
    sum += 1200;
  } else if (m.isBetween("2022-07-01", "2022-08-25", undefined, "[]")) {
    sum += 1600;
  } else {
    sum += 900;
  }
}

//Запрос к боту по URL с сообщением
function sendMessage(sum, token) {
  var text = encodeURI(`Запрос на бронирование на сумму: ${sum}`);
  url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=@samburova48&parse_mode=HTML&text=${text}`;
  fetch(url).then((res) => console.log(res));
  confirm("Спасибо, за Ваш запрос! Мы свяжемся с Вами в ближайшее время!");
}

// review
