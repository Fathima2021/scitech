import styles from './product-party.module.css';
import React, { ReactElement, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import { CustomToggle } from '..';
import { faChevronDown, faEdit } from '@fortawesome/free-solid-svg-icons';
import { EventsEnum } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { IParty, IProduct, ISide } from '../../store/store.interface';
import { fetchProducts, fetchProductsCategories } from '../../store/actions/claims.actions';
import { fetchEvidences } from '../../store/actions/evidences.actions';

const ProductParty = (): ReactElement => {
  const [active, setActive] = useState({
    party: {} as IParty,
    product: {} as IProduct,
  });

  const state: any = useSelector((state) => state);
  const dispatch = useDispatch();

  /* ================================================================= */
  useEffect(() => {
    updateActiveParty();
  }, [state?.claims?.active?.partyId]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [state?.claims?.active?.partyId, state?.claims?.active?.patentId]);

  useEffect(() => {
    if (state?.claims?.active?.accusedProductId) {
      updateActiveProduct();
    }
    dispatch(fetchProductsCategories());
  }, [state?.claims?.active?.accusedProductId]);

  useEffect(() => {
    // dispatch(
    //   fetchEvidences({
    //     // type: paneState.type,
    //   }),
    // );
  }, [state?.claims?.active?.elementId, state?.claims?.active?.partyId, state?.claims?.active?.accusedProduct]);

  /* ================================================================= */

  /* ================================================================= */

  const onAccusedProductUpdate = (product: IProduct) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_PRODUCT, data: { accusedProductId: product.AccusedProductId } });
  };

  const onPartyUpdate = (partyId: any) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_PARTY, data: { partyId } });
  };

  const updateActiveProduct = () => {
    const _active = state?.claims.products.find(
      (sd: IProduct) => sd.AccusedProductId === state?.claims?.active?.accusedProductId,
    );
    setActive((_state) => ({ ..._state, product: _active }));
  };

  const updateActiveParty = () => {
    const _active = state?.claims.parties.find((sd: ISide) => sd.Party?.Id === state?.claims?.active?.partyId);
    setActive((_state) => ({ ..._state, party: _active?.Party }));
  };

  /* ================================================================= */

  return (
    <div className={styles.entity_select_container}>
      <FontAwesomeIcon icon={faEdit} style={{ fontSize: 16, cursor: 'pointer' }} />
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
          <span style={{ padding: '10px', fontSize: 16 }}>{active?.party?.Name || '...'}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: '18vw' }}>
          {((state.claims.parties as ISide[]) || [])
            .filter((sd) => !sd.isCounterSide)
            .map((side: ISide) => (
              <Dropdown.Item key={side?.Party?.Id?.toString()} onClick={() => onPartyUpdate(side?.Party?.Id)}>
                {side?.Party?.Name}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
          <span style={{ padding: '10px', fontSize: 16 }}>{active?.product?.ProductName || '...'}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: '18vw' }}>
          {((state?.claims?.products as IProduct[]) || []).map((product: IProduct) => (
            <Dropdown.Item
              onClick={() => onAccusedProductUpdate(product)}
              key={product.AccusedProductId?.toString()}
              className={product.AccusedProductId === active.product.AccusedProductId ? 'selected' : ''}
            >
              {product?.ProductName || '...'}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ProductParty;
