import * as TypeBox from "@sinclair/typebox";
export * from "@sinclair/typebox";

export class OpenApiTypeBuilder extends TypeBox.JsonTypeBuilder {
  public Nullable<T extends TypeBox.TSchema>(schema: T) {
    return Type.Unsafe<TypeBox.Static<T> | null>({ nullable: true, ...schema });
  }
  public StringEnum<T extends string[]>(values: [...T], opts: TypeBox.ObjectOptions = {}) {
    return Type.Unsafe<T[number]>({
      enum: values,
      ...opts,
    });
  }

  public DateTime(opts: TypeBox.ObjectOptions = {}) {
    return TypeBox.Unsafe<Date>({
      type: "string",
      format: "date-time",
      ...opts,
    });
  }

  public NullableRef<T extends TypeBox.TSchema>(schema: T) {
    return TypeBox.Unsafe<T>({
      nullable: true,
      allOf: [{ $ref: schema.$id }],
    });
  }

  public PartialObject<T extends TypeBox.TProperties>(
    properties: T,
    options: TypeBox.ObjectOptions = {}
  ) {
    return TypeBox.Partial(TypeBox.Object(properties), options);
  }

  public SchemaRef<T extends TypeBox.TSchema>(schema: T) {
    if (!schema.$id) {
      throw new Error("Schema must have an $id");
    }

    return TypeBox.Unsafe<TypeBox.Static<T>>(TypeBox.Ref(schema.$id));
  }
}

export const Type = new OpenApiTypeBuilder();
export { Type as T };
