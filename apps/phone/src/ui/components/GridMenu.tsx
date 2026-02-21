import React, { Fragment } from 'react';
import { AppIcon } from './AppIcon';
import { Grid } from './ui/grid';
import { Flex } from './ui/flex';
import { Link } from 'react-router-dom';
import { IApp } from '@os/apps/config/apps';

interface GridMenuProps {
  items: IApp[];
  Component?: React.ElementType;
}

export const GridMenu: React.FC<GridMenuProps> = ({ items, Component = AppIcon }) => {
  return (
    <Grid cols={4} className="w-full">
      {items &&
        items.length &&
        items.map((item) => (
          <Fragment key={item.id}>
            {!item.isDisabled && (
              <div key={item.id} className="flex flex-col items-center py-2">
                <Flex justify="center" className="w-full">
                  <Link to={item.path}>
                    <Component {...item} />
                  </Link>
                </Flex>
              </div>
            )}
          </Fragment>
        ))}
    </Grid>
  );
};
