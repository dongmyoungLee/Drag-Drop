import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "2px 0px 25px rgba(0,0,0, 0.1)" : "none"};
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  position: relative;
`;

const Btn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  border: none;
  background-color: #3f8cf2;
  color: white;
  cursor: pointer;
`;

interface IDraggabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggabbleCardProps) {
  const setToDos = useSetRecoilState(toDoState);

  const onDeleteClick = (id: string) => {
    setToDos((toDoCards) => {
      const copyBoard = { ...toDoCards }; // 현재 모든 toDos 배열
      const keys = Object.keys(copyBoard); // key값
      console.log(copyBoard);
      keys.forEach((key) => {
        copyBoard[key] = toDoCards[key].filter(
          (toDoCard) => toDoCard.id !== Number(id)
        );
      });
      // toDo 배열에다가 현재 todo 배열 id와 누른 리스트의 배열와 같지 않은 배열전체를 다시 state를 업데이트해준다.
      return copyBoard;
    });
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <Btn
            onClick={() => {
              onDeleteClick(magic.draggableProps["data-rbd-draggable-id"]);
            }}
          >
            삭제
          </Btn>
        </Card>
      )}
    </Draggable>
  );
}

// Droppable, Board, DragDropCeontext 등 부모 State가 바뀌면 자식도 자식의 자식도 모두 리 렌더링 된다.

// react memo 는 prop 이 바뀌지 않는다면 컴포넌트를 렌더링 하지말라고 한다.
export default React.memo(DraggableCard);
