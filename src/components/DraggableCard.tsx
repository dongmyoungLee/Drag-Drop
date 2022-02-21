import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
  border-radius: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  margin-bottom: 5px;
`;

interface IDraggabbleCardProps {
  toDo: string;
  index: number;
}

function DraggableCard({ toDo, index }: IDraggabbleCardProps) {
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

// Droppable, Board, DragDropCeontext 등 부모 State가 바뀌면 자식도 자식의 자식도 모두 리 렌더링 된다.

// react memo 는 prop 이 바뀌지 않는다면 컴포넌트를 렌더링 하지말라고 한다.
export default React.memo(DraggableCard);
