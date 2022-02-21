import { atom, selector } from "recoil";

interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "계 획": ["a", "b"],
    "진 행 중": ["c", "d", "e"],
    "완 료": ["f"],
  },
});
