import React, { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  color: white;
`;

const AddBoard = styled.form`
  input {
    text-align: center;
  }
  button {
    margin-left: 5px;
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const addBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.boardName;

    if (input.value === "") {
      alert("내용을 작성해주세요.");
      return;
    }

    setToDos((allboards) => {
      return {
        ...allboards,
        [input.value]: [],
      };
    });
    input.value = "";
    input.blur();
  };

  //onDragEnd = 유저가 드래그를 끝낸 시점에 불려지는 함수
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // 같은 보드에서 움직이는 경우
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]]; // boardCopy -> 내가 누른 board 배열이 카피됨.

        const taskObj = boardCopy[source.index];
        console.log(boardCopy); // 전체배열
        console.log(taskObj); // 전체배열중 내가 고른 리스트

        //1) 처음 드래그 한 타겟을 배열에서 삭제
        boardCopy.splice(source.index, 1);
        //2) 내가 들어갈 자리에 추가
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }

    if (destination.droppableId !== source.droppableId) {
      // 다른 보드로 이동하는 경우

      setToDos((allBoard) => {
        // 클릭한 보드
        const sourceBoard = [...allBoard[source.droppableId]];

        const taskObj = sourceBoard[source.index];

        // 드롭되는 보드
        const destinationBoard = [...allBoard[destination.droppableId]];
        // 움직임이 시작될때 배열에서 타겟 지워줌
        sourceBoard.splice(source.index, 1);
        // 드롭되는 보드의 배열에 넣어줌
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  /*
    1.드래그가 끝난 시점에서 계획, 진행중, 완료 모든 배열을 가지고있음.
    2. 모든 배열들 중 source.droppableId 의 배열만 boardCopy로 복사했음.
    3. splice 로 내가 고른 타겟을 배열에서 삭제함. 
    4. splice 로 내가 들어갈 자리에 추가해줌. 
    5. 그리고 다른 배열들을 모두 return 하면서 source.droppableId board 에는 복사본을 넣어주고 return 해줌
  */
  useEffect(() => {
    const localStorageToDo = localStorage.getItem("myList");

    if (localStorageToDo === "{}" || localStorageToDo === null) return;

    setToDos(JSON.parse(localStorageToDo));
  }, []);

  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(toDos));
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Title>
            Drag & Drop!
            <br />
            ToDo-List
          </Title>
          <AddBoard onSubmit={addBoard}>
            <input
              id="boardName"
              placeholder="board to created"
              autoComplete="off"
            />
            <button>
              <span>추가</span>
            </button>
          </AddBoard>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

/*
 DragDropContext 를 앱전체가 아닌 유저가 DnD 할 특정 영역에만 생성함.
 onDragEnd -> 유저가 드래그를 끝낸 시점에 불려지는 함수이다.



 droppable -> 어떤것을 드롭할 수 있는 영역
 droppable 의 children 은 react 요소이면안됨. 함수여야됨 (prop을받기위해), droppableId 를 각자 다르게 넣어줘야하고
 포함하는 요소에 ref 속성을 꼭 줘야함. props로 받아온 magic의 모든 속성을 ul 속성에넣어줌

 


 droggable -> 드래그 할 수 있는 영역
 droggable 의 children 은 react 요소이면안됨. 함수여야됨
 droppable 이랑 마찬가지.
 dragHandleProps 속성이 들어간 주체가 드래그 마우스포인터를 가짐.

 -> 여기까지오면 마우스포인터가 바뀌며 드래그가 가능해진다.


 */
export default App;
