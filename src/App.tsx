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
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  //onDragEnd = 유저가 드래그를 끝낸 시점에 불려지는 함수
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // 같은 보드에서 움직이는 경우
      console.log(info);
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]]; // boardCopy -> 내가 누른 board 배열이 카피됨.

        const taskObj = boardCopy[source.index];
        console.log(boardCopy);
        console.log(taskObj);
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
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Title>
            Drag & Drop
            <br />
            ToDo-List
          </Title>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}
// Droppable 무언가를 dnd할수있는, 해오는 영역, 드래그 할 영역 자식으로 함수
// Draggable : Droppable 안에서 드래그 하는 영역
export default App;
