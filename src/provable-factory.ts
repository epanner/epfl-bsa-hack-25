import { ProvableType } from 'o1js';
import { assert, hasProperty } from './util.ts';

export { ProvableFactory, type SerializedFactory };

type Constructor<T = any> = new (...args: any) => T;

/**
 * Standard interface for polymorphic provable type that can be serialized.
 */
type ProvableFactory<N extends string = string, T = any, V = any> = ((
  ...args: any
) => Constructor<T> & ProvableType<T, V>) & {
  name: N;
  Base: Constructor<T>;
};

type Serializer<
  A extends ProvableFactory = ProvableFactory,
  S extends Serialized = Serialized,
  V = any
> = {
  typeToJSON(constructor: ReturnType<A>): S;

  typeFromJSON(json: S): ReturnType<A> | undefined;

  valueToJSON(type: ReturnType<A>, value: InstanceType<ReturnType<A>>): V;

  valueFromJSON(
    type: ReturnType<A>,
    json: V
  ): InstanceType<ReturnType<A>> | undefined;
};

type SerializedFactory = {
  _type: string;
  _isFactory: true;
} & Serialized;

type Serialized = Record<string, any>;

type MapValue = { base: ProvableFactory['Base'] } & Serializer;
const factories = new Map<string, MapValue>();

const ProvableFactory = {
  register<A extends ProvableFactory, S extends Serialized, V>(
    factory: A,
    serialize: Serializer<A, S, V>
  ) {
    assert(!factories.has(factory.name), 'Factory already registered');
    factories.set(factory.name, { base: factory.Base, ...serialize });
  },

  getRegistered(value: unknown) {
    let entry: [string, MapValue] | undefined;
    for (let [key, factory] of factories.entries()) {
      if (value instanceof factory.base) {
        entry = [key, factory];
      }
    }
    return entry;
  },

  tryToJSON(constructor: unknown): SerializedFactory | undefined {
    if (!hasProperty(constructor, 'prototype')) return undefined;
    let entry = ProvableFactory.getRegistered(constructor.prototype);
    if (entry === undefined) return undefined;
    let [key, factory] = entry;
    let json = factory.typeToJSON(constructor as any);
    return { _type: key, ...json, _isFactory: true as const };
  },

  tryValueToJSON(
    value: unknown
  ): (SerializedFactory & { value: any }) | undefined {
    let entry = ProvableFactory.getRegistered(value);
    if (entry === undefined) return undefined;
    let [key, factory] = entry;
    let serializedType = factory.typeToJSON(value!.constructor as any);
    return {
      _type: key,
      ...serializedType,
      value: factory.valueToJSON(value!.constructor as any, value),
      _isFactory: true as const,
    };
  },

  isSerialized(json: unknown): json is SerializedFactory {
    return hasProperty(json, '_isFactory') && json._isFactory === true;
  },

  fromJSON(json: SerializedFactory): Constructor & ProvableType {
    let factory = factories.get(json._type);
    assert(factory !== undefined, `Type '${json._type}' not registered`);

    let serialized = factory.typeFromJSON(json);
    assert(
      serialized !== undefined,
      `Invalid serialization of type '${json._type}'`
    );
    return serialized;
  },

  valueFromJSON(json: Serialized & { value: any }): any {
    let factory = factories.get(json._type);
    assert(factory !== undefined, `Type '${json._type}' not registered`);

    let type = factory.typeFromJSON(json);
    assert(type !== undefined, `Invalid serialization of type '${json._type}'`);
    return factory.valueFromJSON(type, json.value);
  },
};
