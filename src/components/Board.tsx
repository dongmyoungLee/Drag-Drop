import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DragabbleCard from "./DraggableCard";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 10px;
  border: none;
  background-color: #3f8cf2;
  color: white;
  cursor: pointer;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    width: 80%;
    height: 30px;
    border-radius: 15px;
    border: none;
    text-align: center;
    margin-bottom: 10px;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };

  const removeBoard = (id: string) => {
    setToDos((allBoards) => {
      const copyboard = { ...allBoards };
      console.log(copyboard);
      delete copyboard[id];
      return copyboard;
    });
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
          autoComplete="off"
        />
      </Form>

      <Droppable droppableId={boardId}>
        {(magic, info) => (
          //drop 받는역할은 Area

          <Area
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            isDraggingOver={info.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            <DBtn
              onClick={() =>
                removeBoard(magic.droppableProps["data-rbd-droppable-id"])
              }
            >
              X
            </DBtn>
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

// ref={magic.innerRef} -> beautiful-dnd가 HTML 요소에 접근할수 있어야한다는것. beautiful-dnd를 이용해 transformation 을 하고 eventlistener 집어넣고 여러가지를 시작하는 트리거역할을 해줌 reference란 우리가 HTML 요소를 가져와서 그걸 변형할 수 있도록 해주는것.

export default Board;
