from aiogram import Dispatcher, Bot, executor
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

bot = Bot("")

dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start(mesaege: Message):
    markup = InlineKeyboardMarkup().add(InlineKeyboardButton("Открыть Магазин", web_app=WebAppInfo(url="https://untitled-devs.ru/")))
    await mesaege.answer("Привет! Добро пожаловать на маркетплейс!", reply_markup=markup)


if __name__ == "__main__":
    executor.start_polling(dp)