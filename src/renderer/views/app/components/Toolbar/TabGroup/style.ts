import styled, { css } from 'styled-components';

export const StyledTabGroup = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const Line = styled.div`
  height: 2px;
  left: 0;
  bottom: 0;
  position: absolute;
  border-radius: 4px;
`;

export const Placeholder = styled.div`
  padding: 7px;
  border-radius: 16px;
  -webkit-app-region: no-drag;
  overflow: hidden;
  position: relative;

  &:after {
    content: '';
    transition: 0.1s opacity;
    opacity: 0;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0%;
  }

  &:hover {
    &:after {
      opacity: 0.3;
    }
  }
`;